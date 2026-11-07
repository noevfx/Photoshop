import { INSTANT_INTENTS, OTHER_DESCRIPTION, OTHER_INTENT, findIntent, hasUnboundedQuantifier, } from './catalog.js';
export const THRESHOLDS = {
    /** Intent confidence needed to skip the LLM. Docs suggest ~0.85 for acting directly. */
    instant: 0.85,
    /** A slot value (number, choice) must be at least this sure. */
    slot: 0.7,
    /** P(yes) needed before a yes/no slot changes a tool default. */
    flag: 0.8,
    /** P(yes) needed to keep an option of a multi-select slot. */
    multi: 0.7,
    /** P(multi-step) must stay below this for a single instant command. */
    multiStepMax: 0.3,
    /** P(multi-step) must reach this before a split prompt runs as a chain. */
    chainMultiStepMin: 0.6,
    /** Below this P(actionable) we ask a question first. */
    clarifyBelow: 0.35,
    /**
     * Multi-step prompts score lower on "actionable" simply because they have
     * more parts; the planner can handle them, so only ask first when very low.
     */
    clarifyBelowMultiStep: 0.15,
    /** Above this P(needs visual) the agent loop with previews is used. */
    visualMin: 0.6,
    /** Above this P(multi-step) the Action Plan is used. */
    planMin: 0.5,
};
/** Longest chain that may run without the planner. */
export const MAX_CHAIN_STEPS = 4;
const NONE = 'none';
/** Candidate numbers for the pre-parsed value pattern: Jev picks one, code parses it. */
export function extractNumbers(prompt) {
    const found = prompt.match(/\d{1,4}(?:[.,]\d+)?/g) ?? [];
    return [...new Set(found.map((n) => n.replace(',', '.')))].slice(0, 12);
}
// ── Splitting a prompt into steps ─────────────────────────────────────────
/** Sentence ends and commas (not decimal commas), semicolons, new lines. */
const HARD_BREAK = /\s*(?:[;\n]|(?<!\d),|,(?!\d)|[.!?](?=\s|$))\s*/u;
/** Connecting words, longest first. Letters may not touch them on either side. */
const CONNECTOR = new RegExp(String.raw `\s*(?<!\p{L})(?:` +
    [
        String.raw `ve\s+(?:daha\s+)?sonra`,
        String.raw `ve\s+ardından`,
        String.raw `daha\s+sonra`,
        'sonrasında',
        'ardından',
        'sonra',
        String.raw `and\s+then`,
        String.raw `after\s+that`,
        'afterwards',
        'then',
        've',
        'and',
    ].join('|') +
    String.raw `)(?!\p{L})\s*`, 'iu');
/** Turkish "-ıp/-ip/-up/-üp" joins two actions ("çoğaltıp opaklığını 50 yap"). */
const CONVERB = /^\p{L}{2,}(?:ıp|ip|up|üp)$/u;
const NOT_CONVERB = new Set([
    'grup', 'kulüp', 'tip', 'kip', 'çip', 'slip', 'klip',
    'clip', 'flip', 'strip', 'ship', 'skip', 'chip', 'tooltip', 'drip', 'grip', 'trip', 'whip', 'tulip',
    'setup', 'backup', 'popup', 'group', 'cleanup', 'makeup', 'lookup', 'pickup', 'mockup', 'markup',
    'lineup', 'closeup', 'startup', 'signup', 'warmup', 'catchup',
]);
/** Names that contain a connector but are one thing ("black and white", "dodge and burn"). */
const JOINED_NAMES = [
    /black\s+(?:and|&)\s+white/giu,
    /siyah\s+(?:ve|&)\s+beyaz/giu,
    /teal\s+(?:and|&)\s+orange/giu,
    /dodge\s+(?:and|&)\s+burn/giu,
    /select\s+and\s+mask/giu,
];
/** Politeness and filler that is not a step of its own. */
const FILLER = /^(?:lütfen|please|pls|thanks|thank you|teşekkürler|teşekkür ederim|sağ ?ol|hemen|şimdi|now|ok|okay|tamam)$/iu;
function splitConverbs(part) {
    const words = part.split(' ');
    const out = [];
    let current = [];
    words.forEach((word, i) => {
        current.push(word);
        const bare = word.toLowerCase().replace(/[^\p{L}]/gu, '');
        if (i < words.length - 1 && CONVERB.test(bare) && !NOT_CONVERB.has(bare)) {
            out.push(current.join(' '));
            current = [];
        }
    });
    if (current.length)
        out.push(current.join(' '));
    return out;
}
/**
 * Cut a prompt into the parts a chain would run, in order. Returns [] unless
 * there are 2..MAX_CHAIN_STEPS parts. A wrong cut is harmless: Jev then marks
 * a part as `other` (or the whole request as single-step) and nothing runs
 * without the planner.
 */
export function splitSteps(prompt) {
    // Park joined names behind placeholders so their "and"/"ve" is not a cut point.
    const kept = [];
    let text = prompt.replace(/[ \t]+/g, ' ').trim();
    for (const name of JOINED_NAMES)
        text = text.replace(name, (m) => `\uE000${kept.push(m) - 1}\uE001`);
    const parts = text
        .split(HARD_BREAK)
        .flatMap((part) => part.split(CONNECTOR))
        .flatMap(splitConverbs)
        .map((part) => part.replace(/\uE000(\d+)\uE001/gu, (_, i) => kept[Number(i)] ?? ''))
        .map((part) => part.replace(/^[\s,.;:!?-]+|[\s,.;:!?-]+$/gu, '').trim())
        .filter((part) => /\p{L}/u.test(part) && !FILLER.test(part));
    return parts.length >= 2 && parts.length <= MAX_CHAIN_STEPS ? parts : [];
}
function intentCriteria() {
    const intents = {};
    for (const intent of INSTANT_INTENTS)
        intents[intent.id] = intent.describe;
    intents[OTHER_INTENT] = OTHER_DESCRIPTION;
    return intents;
}
function intentQuestion() {
    return {
        type: 'choice',
        instructions: 'The `request` is what a user typed to control Adobe Photoshop. Which single command is it? Pick `other` if it asks for more than one change or for anything not listed.',
        criteria: intentCriteria(),
    };
}
/** Round one, whole prompt: which command, and the routing signals. */
export function buildQuestions() {
    return {
        intent: intentQuestion(),
        multi_step: {
            type: 'noul',
            instructions: 'Does the `request` ask for more than one separate edit or operation?',
        },
        needs_visual: {
            type: 'noul',
            instructions: 'To carry out the `request`, would someone have to look at the image first to decide what to change (for example "make it look better" or "fix what looks off")?',
        },
        actionable: {
            type: 'noul',
            instructions: 'Is the `request` specific enough to carry out without asking the user a follow-up question? A request with several clear steps counts as specific.',
        },
    };
}
/** Round one, one part of a split prompt: the same command question, on that part alone. */
export function buildStepQuestions() {
    return { intent: intentQuestion() };
}
/**
 * Round two: the value questions for one picked command, asked about its own
 * text. Keys are the slot keys (`opacity`, `platforms.x_post`); the caller
 * prefixes them with the target's prefix when merging answers.
 */
export function buildSlotQuestions(target) {
    const questions = {};
    for (const slot of target.intent.slots ?? []) {
        if (slot.kind === 'choice') {
            questions[slot.key] = {
                type: 'choice',
                instructions: slot.question,
                criteria: { ...slot.options, [NONE]: 'Not stated.' },
            };
        }
        else if (slot.kind === 'number') {
            const numbers = extractNumbers(target.text);
            if (numbers.length === 0)
                continue;
            const criteria = {};
            for (const n of numbers)
                criteria[n] = null;
            criteria[NONE] = 'None of these numbers is that value.';
            questions[slot.key] = { type: 'choice', instructions: slot.question, criteria };
        }
        else if (slot.kind === 'flag') {
            questions[slot.key] = { type: 'noul', instructions: slot.question };
        }
        else {
            for (const [option, description] of Object.entries(slot.options)) {
                questions[`${slot.key}.${option}`] = { type: 'noul', instructions: `${slot.question} ${description}` };
            }
        }
    }
    return questions;
}
function choiceOf(answers, key) {
    const a = answers[key];
    return a && typeof a.choice === 'string' && typeof a.confidence === 'number'
        ? { choice: a.choice, confidence: a.confidence }
        : null;
}
function noulOf(answers, key, fallback) {
    const a = answers[key];
    return a && typeof a.noul === 'number' ? a.noul : fallback;
}
function signalsOf(answers) {
    return {
        multiStep: noulOf(answers, 'multi_step', 0.5),
        needsVisual: noulOf(answers, 'needs_visual', 0),
        actionable: noulOf(answers, 'actionable', 1),
    };
}
/**
 * A split prompt whose parts are labelled as something other than the single
 * command means the single command would drop part of the request.
 */
function partDisagrees(answers, steps, intentId) {
    return steps.some((_, i) => {
        const part = choiceOf(answers, `step_${i + 1}`);
        return part !== null && part.choice !== intentId;
    });
}
/**
 * Which commands could run instantly, before their values are known: a single
 * confident command, or else a chain where every part is a confident command.
 */
export function instantTargets(answers, prompt, steps = []) {
    const signals = signalsOf(answers);
    const whole = choiceOf(answers, 'intent');
    const single = whole ? findIntent(whole.choice) : undefined;
    if (whole &&
        single &&
        !single.risky &&
        !single.unfillable &&
        whole.confidence >= THRESHOLDS.instant &&
        signals.multiStep < THRESHOLDS.multiStepMax &&
        !partDisagrees(answers, steps, single.id)) {
        return [{ intent: single, text: prompt, prefix: 's0', confidence: whole.confidence }];
    }
    if (steps.length < 2 || steps.length > MAX_CHAIN_STEPS || signals.multiStep < THRESHOLDS.chainMultiStepMin) {
        return null;
    }
    const targets = [];
    for (let i = 0; i < steps.length; i++) {
        const answer = choiceOf(answers, `step_${i + 1}`);
        const intent = answer ? findIntent(answer.choice) : undefined;
        if (!answer || !intent || intent.risky || intent.unfillable || answer.confidence < THRESHOLDS.instant)
            return null;
        targets.push({ intent, text: steps[i], prefix: `s${i + 1}`, confidence: answer.confidence });
    }
    return targets;
}
function resolveSlots(intent, answers, prefix) {
    const values = {};
    for (const slot of intent.slots ?? []) {
        const key = `${prefix}.${slot.key}`;
        if (slot.kind === 'choice') {
            const a = choiceOf(answers, key);
            if (a && a.choice !== NONE && a.confidence >= THRESHOLDS.slot && a.choice in slot.options) {
                values[slot.key] = a.choice;
            }
        }
        else if (slot.kind === 'number') {
            const a = choiceOf(answers, key);
            if (a && a.choice !== NONE && a.confidence >= THRESHOLDS.slot) {
                const raw = Number(a.choice);
                const n = slot.integer ? Math.round(raw) : raw;
                if (Number.isFinite(n) && n >= slot.min && n <= slot.max)
                    values[slot.key] = n;
            }
        }
        else if (slot.kind === 'flag') {
            if (noulOf(answers, key, 0) >= THRESHOLDS.flag)
                values[slot.key] = slot.value;
        }
        else {
            const chosen = Object.keys(slot.options).filter((option) => noulOf(answers, `${key}.${option}`, 0) >= THRESHOLDS.multi);
            if (chosen.length > 0)
                values[slot.key] = chosen;
        }
    }
    const missing = (intent.requires ?? []).filter((k) => values[k] === undefined);
    return { values, missing };
}
/** Pure decision logic: Jev answers in, route out. */
export function decide(answers, meta, ctx = {}) {
    const steps = ctx.steps ?? [];
    const slotsAnswered = ctx.slotsAnswered !== false;
    const intentAnswer = choiceOf(answers, 'intent') ?? { choice: OTHER_INTENT, confidence: 0 };
    const signals = signalsOf(answers);
    const base = { intent: intentAnswer.choice, confidence: intentAnswer.confidence, signals, ...meta };
    const intent = findIntent(intentAnswer.choice);
    const targets = instantTargets(answers, ctx.prompt ?? '', steps);
    let unbounded = false;
    if (targets) {
        const calls = [];
        for (const target of targets) {
            if (!slotsAnswered && (target.intent.slots?.length ?? 0) > 0)
                break;
            const { values, missing } = resolveSlots(target.intent, answers, target.prefix);
            if (missing.length > 0)
                break;
            const openNumber = (target.intent.slots ?? []).some((slot) => slot.kind === 'number' && values[slot.key] === undefined);
            if (openNumber && hasUnboundedQuantifier(target.text)) {
                unbounded = true;
                break;
            }
            const label = target.intent.describeCall?.(values) ?? target.intent.label;
            calls.push({ tool: target.intent.tool, args: target.intent.args(values), preview: Boolean(target.intent.preview), label });
        }
        if (!unbounded && calls.length === targets.length) {
            const chain = calls.length > 1;
            return {
                ...base,
                ...(chain
                    ? {
                        intent: targets.map((t) => t.intent.id).join('+'),
                        confidence: Math.min(...targets.map((t) => t.confidence)),
                        steps,
                    }
                    : {}),
                route: 'instant',
                label: calls.map((c) => c.label).join(' → '),
                calls,
                reason: chain
                    ? `${calls.length} known commands; they run in order without a language model call.`
                    : 'One known command; runs directly without a language model call.',
            };
        }
    }
    if (unbounded) {
        return {
            ...base,
            route: 'plan',
            label: 'Plan',
            reason: 'The request names every change rather than a step count, so the model plans it.',
        };
    }
    const clarifyBelow = signals.multiStep >= THRESHOLDS.planMin ? THRESHOLDS.clarifyBelowMultiStep : THRESHOLDS.clarifyBelow;
    // A picked tool is specific enough to plan. Ask first only when nothing matched.
    if (!intent && signals.actionable < clarifyBelow) {
        return { ...base, route: 'clarify', label: 'Ask first', reason: 'Too vague to act on safely; the model asks one question first.' };
    }
    if (signals.needsVisual >= THRESHOLDS.visualMin) {
        return { ...base, route: 'agent', label: 'Look & iterate', reason: 'Needs to look at the image; the model gets previews as it works.' };
    }
    const risky = intent?.risky
        ? intent
        : steps
            .map((_, i) => choiceOf(answers, `step_${i + 1}`))
            .map((a) => (a && a.confidence >= THRESHOLDS.instant ? findIntent(a.choice) : undefined))
            .find((i) => i?.risky);
    if (risky) {
        return { ...base, route: 'plan', label: 'Plan', reason: `${risky.label} is hard to undo, so it goes through a plan.` };
    }
    if (intent?.unfillable) {
        return {
            ...base,
            route: 'plan',
            label: 'Plan',
            reason: `${intent.label} needs a value Jev cannot write, so the model plans it.`,
        };
    }
    const partial = intent !== undefined && partDisagrees(answers, steps, intent.id);
    return {
        ...base,
        route: 'plan',
        label: 'Plan',
        reason: signals.multiStep >= THRESHOLDS.planMin
            ? 'Several operations; one planning call, then the steps run directly.'
            : partial
                ? 'Part of the request is not that one command, so the model plans it.'
                : intent
                    ? 'Not confident enough to run that one command directly, so the model plans it.'
                    : 'Not a single known command; the model plans it.',
    };
}
function prefixed(prefix, answers) {
    const out = {};
    for (const [key, value] of Object.entries(answers))
        out[`${prefix}.${key}`] = value;
    return out;
}
export async function classifyIntent(prompt, client, options = {}) {
    const now = options.now ?? Date.now;
    const started = now();
    const request = prompt.slice(0, 2000);
    const steps = splitSteps(request);
    const callOptions = { signal: options.signal, timeout: options.timeoutMs };
    const ask = (text, questions) => Promise.resolve(client.systemOne({ state: { request: text }, questions }, callOptions));
    // Round one: the whole prompt, plus each part on its own when it was split.
    const [first, ...stepResults] = await Promise.allSettled([
        ask(request, buildQuestions()),
        ...steps.map((step) => ask(step, buildStepQuestions())),
    ]);
    if (first.status === 'rejected')
        throw first.reason;
    let answers = { ...first.value.answers };
    stepResults.forEach((result, i) => {
        if (result.status === 'fulfilled')
            answers[`step_${i + 1}`] = result.value.answers.intent;
    });
    // Round two: values for the picked commands only.
    let slotsAnswered = true;
    const targets = instantTargets(answers, request, steps) ?? [];
    const slotCalls = targets
        .map((target) => ({ target, questions: buildSlotQuestions(target) }))
        .filter(({ questions }) => Object.keys(questions).length > 0);
    if (slotCalls.length > 0) {
        const results = await Promise.allSettled(slotCalls.map(({ target, questions }) => ask(target.text, questions)));
        if (options.signal?.aborted)
            throw options.signal.reason ?? new Error('aborted');
        results.forEach((result, i) => {
            if (result.status === 'fulfilled')
                answers = { ...answers, ...prefixed(slotCalls[i].target.prefix, result.value.answers) };
            else
                slotsAnswered = false;
        });
    }
    return decide(answers, { latencyMs: Math.max(0, now() - started), model: first.value.model }, { prompt: request, steps, slotsAnswered });
}
//# sourceMappingURL=router.js.map