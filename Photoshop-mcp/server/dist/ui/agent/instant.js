import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { randomUUID } from 'node:crypto';
import { buildSpawnArgs, buildUiMcpChildEnv } from './mcp-transport.js';
import { finishToolCall, toolFailureMessage, } from './shared.js';
const ZERO_COST = { totalUsd: 0, inputUsd: 0, outputUsd: 0, cachedReadUsd: 0, cachedWriteUsd: 0 };
const ZERO_USAGE = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    inputTokenDetails: { noCacheTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
    outputTokenDetails: { textTokens: 0, reasoningTokens: 0 },
};
/**
 * Start the MCP child and check every tool exists. Returns null (caller falls
 * back to the normal LLM route) instead of failing the turn.
 */
export async function prepareInstant(calls, chatId) {
    if (calls.length === 0)
        return null;
    let mcp;
    try {
        mcp = await createMCPClient({
            transport: new Experimental_StdioMCPTransport({
                command: process.execPath,
                args: buildSpawnArgs(),
                env: buildUiMcpChildEnv(chatId),
            }),
        });
        const tools = (await mcp.tools());
        if (calls.some((call) => typeof tools[call.tool]?.execute !== 'function')) {
            await mcp.close();
            return null;
        }
        return { mcp, tools, calls };
    }
    catch {
        await mcp?.close().catch(() => undefined);
        return null;
    }
}
export async function* runChatViaInstant(opts) {
    const { mcp, tools, calls } = opts.prepared;
    const buffer = { text: '', toolCalls: [] };
    const runTool = async function* (name, args) {
        const id = randomUUID();
        buffer.toolCalls.push({ id, name, input: args, status: 'pending', startedAt: Date.now() });
        yield { type: 'tool-call', payload: { id, name, input: args } };
        yield { type: 'activity', payload: { phase: 'tool-running', detail: name } };
        opts.onAssistantBuffer?.(buffer);
        try {
            const output = await tools[name].execute(args, { toolCallId: id, messages: [], abortSignal: opts.abortSignal });
            const payload = finishToolCall(buffer, id, { output, chatId: opts.chatId });
            yield { type: 'tool-result', payload };
            opts.onAssistantBuffer?.(buffer);
            return { ok: payload.ok, message: payload.ok ? '' : toolFailureMessage(output, payload.content) };
        }
        catch (err) {
            const message = err?.message ?? String(err);
            yield { type: 'tool-result', payload: finishToolCall(buffer, id, { error: message }) };
            opts.onAssistantBuffer?.(buffer);
            return { ok: false, message };
        }
    };
    try {
        const done = [];
        let failure = null;
        for (const call of calls) {
            if (opts.abortSignal.aborted)
                break;
            const result = yield* runTool(call.tool, call.args);
            if (!result.ok) {
                failure = { call, message: result.message };
                break;
            }
            done.push(call);
        }
        const last = done[done.length - 1];
        const wantsPreview = done.some((call) => call.preview) && last?.tool !== 'photoshop_get_preview';
        if (wantsPreview && !opts.abortSignal.aborted && tools.photoshop_get_preview?.execute) {
            yield* runTool('photoshop_get_preview', { max_dimension_px: 1024 });
        }
        buffer.text = instantSummary(calls, done, failure);
        yield { type: 'text-delta', payload: { text: buffer.text } };
        opts.onAssistantBuffer?.(buffer);
        opts.onFinish?.({ usage: ZERO_USAGE, cost: ZERO_COST });
        yield { type: 'finish', payload: { finishReason: 'stop', usage: ZERO_USAGE, cost: ZERO_COST } };
    }
    finally {
        await mcp.close().catch(() => undefined);
    }
}
export function instantSummary(calls, done, failure) {
    const labels = (list) => list.map((call) => call.label).join(' → ');
    if (!failure) {
        return done.length === calls.length ? `Done: ${labels(done)}.` : `Stopped after: ${labels(done) || 'nothing'}.`;
    }
    if (calls.length === 1)
        return `${failure.call.label} did not work: ${failure.message}`;
    const step = calls.indexOf(failure.call) + 1;
    const applied = done.length > 0 ? ` Applied before it: ${labels(done)}.` : '';
    return `Step ${step} of ${calls.length} (${failure.call.label}) did not work: ${failure.message.replace(/\.\s*$/, '')}.${applied}`;
}
//# sourceMappingURL=instant.js.map