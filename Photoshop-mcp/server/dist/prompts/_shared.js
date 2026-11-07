export function argString(args, key, defaultValue) {
    const raw = args[key];
    if (typeof raw !== 'string' || raw.trim() === '')
        return defaultValue;
    return raw.trim();
}
export function argInt(args, key, defaultValue) {
    const raw = args[key];
    if (typeof raw !== 'string' || raw.trim() === '')
        return defaultValue;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : defaultValue;
}
export function argBool(args, key, defaultValue) {
    const raw = args[key];
    if (typeof raw !== 'string')
        return defaultValue;
    const v = raw.trim().toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'y')
        return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'n')
        return false;
    return defaultValue;
}
export function argEnum(args, key, options, defaultValue) {
    const raw = args[key];
    if (typeof raw !== 'string')
        return defaultValue;
    const v = raw.trim().toLowerCase();
    const hit = options.find((o) => o.toLowerCase() === v);
    return hit ?? defaultValue;
}
export function argList(args, key, defaultValue) {
    const raw = args[key];
    if (typeof raw !== 'string' || raw.trim() === '')
        return defaultValue;
    return raw
        .split(/[,\s]+/g)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
export function userPrompt(description, text) {
    return {
        description,
        messages: [{ role: 'user', content: { type: 'text', text } }],
    };
}
export function toPromptDefinition(t) {
    return {
        prompt: {
            name: t.name,
            description: t.description,
            arguments: t.arguments,
        },
        handler: t.handler,
    };
}
//# sourceMappingURL=_shared.js.map