import { type MCPClient } from '@ai-sdk/mcp';
import type { InstantCall } from '../intent/router.js';
import { type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent } from './shared.js';
/**
 * The "instant" route: Jev already picked the tool(s) and their arguments, so
 * run them in order and show one preview at the end. No language model is
 * involved, so there is no token usage or cost for the turn. A chain stops at
 * the first failed step and reports what was applied before it.
 */
type ExecutableTool = {
    execute?: (input: unknown, options: {
        toolCallId: string;
        messages: [];
        abortSignal?: AbortSignal;
    }) => PromiseLike<unknown>;
};
export interface PreparedInstant {
    mcp: MCPClient;
    tools: Record<string, ExecutableTool>;
    calls: InstantCall[];
}
/**
 * Start the MCP child and check every tool exists. Returns null (caller falls
 * back to the normal LLM route) instead of failing the turn.
 */
export declare function prepareInstant(calls: InstantCall[], chatId?: string): Promise<PreparedInstant | null>;
export declare function runChatViaInstant(opts: {
    prepared: PreparedInstant;
    chatId?: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}): AsyncGenerator<RunChatStreamEvent>;
export declare function instantSummary(calls: InstantCall[], done: InstantCall[], failure: {
    call: InstantCall;
    message: string;
} | null): string;
export {};
//# sourceMappingURL=instant.d.ts.map