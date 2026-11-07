export type McpShutdownReason = 'sigint' | 'sigterm' | 'error' | 'stdio_closed' | 'idle_timeout';
export type McpToolBatchFlushReason = 'debounce' | 'max_hold' | 'shutdown' | 'client_disconnect';
export interface PromptBatchSummary {
    prompts_requested_count: number;
    unique_prompts_count: number;
    prompt_usage_summary: string;
    prompts_used: string[];
    full_catalog: boolean;
    catalog_size: number;
    repeat: number;
}
/** Pure burst math for mcp_prompt_batch. catalogSize is the registry count at record time. */
export declare function summarizePromptBatch(counts: ReadonlyMap<string, number>, catalogSize: number): PromptBatchSummary;
/** Virtual /mcp hit so MCP-only installs show up next to UI traffic. */
export declare function captureMcpPageview(): void;
export declare function captureMcpPageleave(durationMs: number, reason: string): void;
export declare function flushMcpToolBatch(reason: McpToolBatchFlushReason): void;
export declare function flushMcpPromptBatch(reason: McpToolBatchFlushReason): void;
export declare function recordMcpPromptRequest(name: string, catalogSize: number): void;
export declare function flushMcpPromptBatchOnClientDisconnect(): void;
export declare function startMcpAnalyticsSession(): void;
/** Process start: emit session/pageview only when the 30m logical window is new. */
export declare function startLogicalMcpAnalyticsSession(properties: {
    photoshop_detected: boolean;
    tools_registered_count: number;
}): void;
export declare function recordMcpToolCall(params: {
    toolName: string;
    ok: boolean;
    errorCode?: string;
    durationMs: number;
}): void;
export declare function flushMcpToolBatchOnClientDisconnect(): void;
export declare function endMcpAnalyticsSession(_reason: McpShutdownReason): void;
//# sourceMappingURL=mcp-session.d.ts.map