import { type InstantIntent } from './catalog.js';
/**
 * Jev intent router for the standalone UI.
 *
 * Jev (TypeSafe `systemOne`) answers a handful of questions about the prompt in
 * parallel; plain code below turns the answers into a route:
 *
 *   instant  – one known, safe command, or a short chain of them → run directly, no LLM call
 *   plan     – several operations that are not all known → Action Plan (one planning LLM call)
 *   agent    – needs to look at the image → agent loop with previews
 *   clarify  – too vague → agent loop told to ask one question first
 *
 * Jev decides, code acts: thresholds live here, not in the model. Jev only
 * picks from options (one per registered MCP tool), so anything that needs
 * free text is left to the planner. Chains are cut at connecting words
 * ("ve", "sonra", "and then", commas) and Jev labels each part; numbers are
 * pre-parsed and Jev picks one. "All / tüm / hepsi" is not a step count.
 *
 * Two rounds at most. Round one routes the whole prompt and, in parallel,
 * labels each part of a split prompt on its own (Jev is most accurate when the
 * state holds only what the question is about). Round two runs only when a
 * picked command has values to fill (a number, a preset, a platform list), again
 * one call per command with just its own text.
 */
export type IntentRoute = 'instant' | 'plan' | 'agent' | 'clarify';
export interface InstantCall {
    tool: string;
    args: Record<string, unknown>;
    preview: boolean;
    label: string;
}
export interface IntentSignals {
    multiStep: number;
    needsVisual: number;
    actionable: number;
}
export interface IntentDecision {
    route: IntentRoute;
    /** Choice label Jev picked (`other` when none fits; `a+b` for a chain). */
    intent: string;
    /** Human text for the chip, e.g. "Undo 1 step" or "Black & white → Opacity 50%". */
    label: string;
    /** Jev's confidence in the intent choice (lowest step for a chain), 0..1. */
    confidence: number;
    signals: IntentSignals;
    /** Tool calls to run in order on the instant route: one, or a short chain. */
    calls?: InstantCall[];
    /** Parts the prompt was split into, when it looked like a chain. */
    steps?: string[];
    reason: string;
    latencyMs: number;
    model: string;
}
/** Minimal slice of the SDK client, so tests can pass a fake. */
export interface SystemOneClient {
    systemOne(request: {
        state: unknown;
        questions: Record<string, unknown>;
    }, options?: {
        signal?: AbortSignal;
        timeout?: number;
    }): PromiseLike<{
        model: string;
        answers: Record<string, unknown>;
    }>;
}
export declare const THRESHOLDS: {
    /** Intent confidence needed to skip the LLM. Docs suggest ~0.85 for acting directly. */
    readonly instant: 0.85;
    /** A slot value (number, choice) must be at least this sure. */
    readonly slot: 0.7;
    /** P(yes) needed before a yes/no slot changes a tool default. */
    readonly flag: 0.8;
    /** P(yes) needed to keep an option of a multi-select slot. */
    readonly multi: 0.7;
    /** P(multi-step) must stay below this for a single instant command. */
    readonly multiStepMax: 0.3;
    /** P(multi-step) must reach this before a split prompt runs as a chain. */
    readonly chainMultiStepMin: 0.6;
    /** Below this P(actionable) we ask a question first. */
    readonly clarifyBelow: 0.35;
    /**
     * Multi-step prompts score lower on "actionable" simply because they have
     * more parts; the planner can handle them, so only ask first when very low.
     */
    readonly clarifyBelowMultiStep: 0.15;
    /** Above this P(needs visual) the agent loop with previews is used. */
    readonly visualMin: 0.6;
    /** Above this P(multi-step) the Action Plan is used. */
    readonly planMin: 0.5;
};
/** Longest chain that may run without the planner. */
export declare const MAX_CHAIN_STEPS = 4;
/** Candidate numbers for the pre-parsed value pattern: Jev picks one, code parses it. */
export declare function extractNumbers(prompt: string): string[];
/**
 * Cut a prompt into the parts a chain would run, in order. Returns [] unless
 * there are 2..MAX_CHAIN_STEPS parts. A wrong cut is harmless: Jev then marks
 * a part as `other` (or the whole request as single-step) and nothing runs
 * without the planner.
 */
export declare function splitSteps(prompt: string): string[];
type Question = {
    type: 'choice';
    instructions: string;
    criteria: Record<string, string | null>;
} | {
    type: 'noul';
    instructions: string;
    criteria?: {
        true?: string;
        false?: string;
    };
};
/** Round one, whole prompt: which command, and the routing signals. */
export declare function buildQuestions(): Record<string, Question>;
/** Round one, one part of a split prompt: the same command question, on that part alone. */
export declare function buildStepQuestions(): Record<string, Question>;
/** An intent picked for instant use, and the text its values come from. */
export interface InstantTarget {
    intent: InstantIntent;
    /** The text this command came from: the whole prompt, or one part. */
    text: string;
    /** Answer key prefix for this target's values: `s0` (single) or `s1..sN` (chain). */
    prefix: string;
    confidence: number;
}
/**
 * Round two: the value questions for one picked command, asked about its own
 * text. Keys are the slot keys (`opacity`, `platforms.x_post`); the caller
 * prefixes them with the target's prefix when merging answers.
 */
export declare function buildSlotQuestions(target: InstantTarget): Record<string, Question>;
/**
 * Which commands could run instantly, before their values are known: a single
 * confident command, or else a chain where every part is a confident command.
 */
export declare function instantTargets(answers: Record<string, unknown>, prompt: string, steps?: string[]): InstantTarget[] | null;
export interface DecideContext {
    prompt?: string;
    steps?: string[];
    /**
     * False when the second (value) call failed. Commands with values then never
     * run instantly, so a stated preset or size is never silently replaced by a default.
     */
    slotsAnswered?: boolean;
}
/** Pure decision logic: Jev answers in, route out. */
export declare function decide(answers: Record<string, unknown>, meta: {
    latencyMs: number;
    model: string;
}, ctx?: DecideContext): IntentDecision;
export declare function classifyIntent(prompt: string, client: SystemOneClient, options?: {
    signal?: AbortSignal;
    timeoutMs?: number;
    now?: () => number;
}): Promise<IntentDecision>;
export {};
//# sourceMappingURL=router.d.ts.map