import { persistToolImages } from '../store/previews.js';
export function stringifyToolOutput(output) {
    if (output == null)
        return '';
    if (typeof output === 'string')
        return output;
    if (typeof output === 'object' && output !== null && 'content' in output) {
        const content = output.content;
        if (Array.isArray(content)) {
            return content
                .map((c) => (typeof c === 'string' ? c : c?.text ?? ''))
                .filter(Boolean)
                .join('\n');
        }
    }
    try {
        return JSON.stringify(output);
    }
    catch {
        return String(output);
    }
}
/**
 * JSON object a later plan step can read with `$steps.<id>.<path>`.
 * MCP tool calls wrap that JSON in `{ content: [{ type: 'text', text }] }`.
 */
export function toolResultData(output) {
    return parseToolEnvelope(output) ?? output;
}
/** Parse structured tool envelopes from raw MCP / SDK output. */
export function parseToolEnvelope(output) {
    if (output && typeof output === 'object' && !Array.isArray(output)) {
        if ('content' in output) {
            const text = stringifyToolOutput(output);
            try {
                const fromText = JSON.parse(text);
                if (fromText && typeof fromText === 'object' && !Array.isArray(fromText)) {
                    return fromText;
                }
            }
            catch {
                return null;
            }
        }
        return output;
    }
    if (typeof output === 'string') {
        try {
            const parsed = JSON.parse(output);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
        }
        catch {
            return null;
        }
    }
    return null;
}
/** Whether a tool output represents success (not an error envelope or MCP error flag). */
export function isToolOutputOk(output) {
    if (output == null)
        return true;
    if (typeof output === 'object' && output !== null) {
        const obj = output;
        if (obj.is_error === true || obj.isError === true)
            return false;
        if ('error' in obj && obj.error)
            return false;
        if (obj.ok === false)
            return false;
        const envelope = parseToolEnvelope(output);
        if (envelope?.ok === false)
            return false;
    }
    if (typeof output === 'string') {
        const envelope = parseToolEnvelope(output);
        if (envelope?.ok === false)
            return false;
    }
    return true;
}
/** Prefer envelope `message` for repair / error display. */
export function toolFailureMessage(output, fallback) {
    const envelope = parseToolEnvelope(output);
    if (envelope && envelope.ok === false && typeof envelope.message === 'string') {
        return envelope.message;
    }
    return fallback;
}
/**
 * Record a finished tool call on the buffer and return the `tool-result` event payload.
 * Pass `output` for a normal result; pass `error` when the call threw.
 */
export function finishToolCall(buffer, toolCallId, result) {
    const failed = result.error !== undefined;
    const content = failed ? result.error : (result.content ?? stringifyToolOutput(result.output));
    const ok = failed ? false : (result.ok ?? isToolOutputOk(result.output));
    const images = failed ? [] : persistToolImages(result.chatId, toolCallId, result.output);
    const tc = buffer.toolCalls.find((c) => c.id === toolCallId);
    const durationMs = tc?.startedAt ? Math.max(0, Date.now() - tc.startedAt) : undefined;
    const persisted = { ok, content, ...(images.length ? { images } : {}) };
    if (tc) {
        tc.result = persisted;
        tc.status = ok ? 'success' : 'error';
        if (durationMs !== undefined)
            tc.durationMs = durationMs;
    }
    return { id: toolCallId, ...persisted, ...(durationMs !== undefined ? { durationMs } : {}) };
}
export function computeCost(usage, pricing) {
    const cacheRead = usage.inputTokenDetails?.cacheReadTokens ?? 0;
    const cacheWrite = usage.inputTokenDetails?.cacheWriteTokens ?? 0;
    const totalInput = usage.inputTokens ?? 0;
    const noCache = usage.inputTokenDetails?.noCacheTokens ??
        Math.max(0, totalInput - cacheRead - cacheWrite);
    const output = usage.outputTokens ?? 0;
    const inputUsd = (noCache / 1_000_000) * pricing.inputUsdPerMTok;
    const outputUsd = (output / 1_000_000) * pricing.outputUsdPerMTok;
    const cachedReadUsd = (cacheRead / 1_000_000) * (pricing.cachedInputUsdPerMTok ?? pricing.inputUsdPerMTok);
    const cachedWriteUsd = (cacheWrite / 1_000_000) * (pricing.cachedWriteUsdPerMTok ?? pricing.inputUsdPerMTok);
    return {
        totalUsd: inputUsd + outputUsd + cachedReadUsd + cachedWriteUsd,
        inputUsd,
        outputUsd,
        cachedReadUsd,
        cachedWriteUsd,
    };
}
export function buildPromptWithHistory(history, prompt) {
    const parts = [];
    for (const m of history) {
        const text = typeof m.content === 'string'
            ? m.content
            : Array.isArray(m.content)
                ? m.content
                    .map((part) => ('text' in part ? part.text : ''))
                    .filter(Boolean)
                    .join('\n')
                : '';
        const trimmed = text.trim();
        if (!trimmed)
            continue;
        parts.push(`${m.role === 'user' ? 'User' : 'Assistant'}: ${trimmed}`);
    }
    parts.push(`User: ${prompt}`);
    return parts.join('\n\n');
}
//# sourceMappingURL=shared.js.map