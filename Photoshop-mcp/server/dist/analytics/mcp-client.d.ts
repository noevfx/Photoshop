/**
 * Fires when an MCP client completes the initialize handshake.
 * See docs/anonymous-usage-analytics.md — distinguishes real client usage from process-only starts.
 */
export declare function onMcpClientConnected(client: {
    name: string;
    version: string;
} | undefined): void;
/** Fires when the MCP transport closes; flushes any pending tool batch first. */
export declare function onMcpClientDisconnected(): void;
//# sourceMappingURL=mcp-client.d.ts.map