import { listToolSurfaces } from './tool-surface.js';
export const OTHER_INTENT = 'other';
export const OTHER_DESCRIPTION = 'Anything else: more than one change, a change that is not listed here, a question, or unclear.';
/** "tüm", "hepsi", "all", "every" — a count the schema cannot take from a digit. */
const UNBOUNDED = /(?<![\p{L}\p{N}])(?:tüm\p{L}*|hepsi\p{L}*|all|every)(?![\p{L}\p{N}])/iu;
export function hasUnboundedQuantifier(text) {
    return UNBOUNDED.test(text);
}
const RISKY_NAME = /(?:^|_)(?:flatten|merge|delete|close)(?:_|$)/;
function typesOf(type) {
    if (Array.isArray(type))
        return type;
    return type ? [type] : [];
}
function humanLabel(name) {
    const bare = name.replace(/^photoshop_/, '').replace(/^recipe_/, '');
    const words = bare.split('_').filter(Boolean);
    return words
        .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ');
}
function optionText(value) {
    if (value === value.toUpperCase() && /[A-Z]/.test(value) && value.length > 1) {
        return value.charAt(0) + value.slice(1).toLowerCase();
    }
    return value.replace(/_/g, ' ');
}
function clip(text) {
    const trimmed = text.trim().replace(/[.]+$/, '');
    return trimmed.length > 180 ? `${trimmed.slice(0, 177)}…` : trimmed;
}
/**
 * Classifier criterion, not the LLM essay. Lead with the name and the phrases
 * people type ("Users often say"), then what the tool does. "Do NOT use",
 * returns and preconditions stay out.
 */
export function shortToolDescription(description, name) {
    const flat = description.replace(/\s+/g, ' ').trim();
    const often = flat.match(/Users often say:\s*(.+?)(?:\s+Use when\b|\s+Do NOT\b|$)/i)?.[1];
    const useWhen = flat.match(/Use when:\s*(.+?)(?:\s+Do NOT\b|$)/i)?.[1];
    const first = flat.split(/(?<=\.)\s/)[0]?.replace(/\.$/, '') ?? '';
    const label = humanLabel(name);
    const parts = [label];
    if (often)
        parts.push(often.replace(/\.$/, ''));
    if (first && first.toLowerCase() !== label.toLowerCase())
        parts.push(first);
    if (useWhen)
        parts.push(useWhen.replace(/\.$/, ''));
    const text = parts.filter(Boolean).join('. ');
    return text ? clip(text) : label;
}
function enumOptions(values) {
    if (!values || values.length === 0)
        return null;
    const options = {};
    for (const value of values) {
        if (typeof value === 'string' || typeof value === 'number') {
            const key = String(value);
            options[key] = optionText(key);
        }
    }
    return Object.keys(options).length > 0 ? options : null;
}
function isRequired(key, prop, required) {
    if (prop.default !== undefined)
        return false;
    return required.has(key);
}
function slotsFromSchema(schema) {
    const properties = (schema.properties ?? {});
    const required = new Set(schema.required ?? []);
    const slots = [];
    const requires = [];
    let unfillable = false;
    for (const [key, prop] of Object.entries(properties)) {
        if (key === 'document_id' || !prop)
            continue;
        const types = typesOf(prop.type);
        const description = typeof prop.description === 'string' ? prop.description : '';
        const enums = enumOptions(prop.enum);
        const must = isRequired(key, prop, required);
        if (enums) {
            slots.push({
                kind: 'choice',
                key,
                question: description || `Which \`${key}\` does the \`request\` name?`,
                options: enums,
            });
            if (must)
                requires.push(key);
            continue;
        }
        if (types.includes('number') || types.includes('integer')) {
            slots.push({
                kind: 'number',
                key,
                question: `Which of these numbers is the \`${key}\` the \`request\` asks for?`,
                min: typeof prop.minimum === 'number' ? prop.minimum : 0,
                max: typeof prop.maximum === 'number' ? prop.maximum : 1_000_000,
                integer: types.includes('integer'),
            });
            if (must)
                requires.push(key);
            continue;
        }
        if (types.includes('boolean')) {
            slots.push({
                kind: 'flag',
                key,
                question: `Does the \`request\` ask for \`${key}\` to be true? ${description}`.trim(),
                value: true,
            });
            if (must)
                requires.push(key);
            continue;
        }
        const itemEnums = enumOptions(prop.items?.enum);
        if (types.includes('array') && itemEnums) {
            slots.push({
                kind: 'multi',
                key,
                question: `Does the \`request\` include this ${key} option:`,
                options: itemEnums,
            });
            if (must)
                requires.push(key);
            continue;
        }
        if (must)
            unfillable = true;
    }
    return { slots, requires, unfillable };
}
function describeCall(label, slots) {
    const parts = Object.entries(slots).map(([key, value]) => Array.isArray(value) ? `${key} (${value.length})` : `${key} ${String(value)}`);
    return parts.length > 0 ? `${label} · ${parts.join(', ')}` : label;
}
function intentFromTool(tool) {
    const label = humanLabel(tool.name);
    const { slots, requires, unfillable } = slotsFromSchema(tool.inputSchema);
    return {
        id: tool.name,
        describe: shortToolDescription(tool.description, tool.name),
        label,
        tool: tool.name,
        ...(slots.length > 0 ? { slots } : {}),
        ...(requires.length > 0 ? { requires } : {}),
        ...(RISKY_NAME.test(tool.name) ? { risky: true } : {}),
        ...(unfillable ? { unfillable: true } : {}),
        preview: !tool.readOnly,
        args: (values) => ({ ...values }),
        describeCall: (values) => describeCall(label, values),
    };
}
export const INSTANT_INTENTS = listToolSurfaces().map(intentFromTool);
export function findIntent(id) {
    return INSTANT_INTENTS.find((intent) => intent.id === id);
}
//# sourceMappingURL=catalog.js.map