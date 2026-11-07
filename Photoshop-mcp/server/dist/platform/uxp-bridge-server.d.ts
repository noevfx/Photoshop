export interface UxpBridgeCommand {
    id: string;
    action: string;
    params: Record<string, unknown>;
}
export interface UxpBridgeResult {
    id: string;
    ok: boolean;
    data?: unknown;
    error?: string;
}
export declare function getUxpBridgePort(): number;
/**
 * True when the Photoshop plugin is connected — the only real signal that
 * the bridge panel is loaded and running. A plain HTTP check of /health
 * only proves this Node server exists, not that anything in Photoshop is
 * talking to it. Liveness is any of:
 * - a `/poll` within PLUGIN_STALE_MS,
 * - a `/result` within PLUGIN_STALE_MS,
 * - a command the plugin picked up but has not resolved yet (its poll loop
 *   awaits commands inline, so polls pause while one runs).
 */
export declare function isUxpPluginPolling(): boolean;
/** Milliseconds since the last plugin contact, or null if it never polled. */
export declare function getLastPollAgeMs(): number | null;
export declare function ensureUxpBridgeServer(): Promise<number>;
export declare function invokeUxpBridge(action: string, params: Record<string, unknown>, timeoutMs?: number): Promise<UxpBridgeResult>;
export declare function shutdownUxpBridgeServer(): Promise<void>;
//# sourceMappingURL=uxp-bridge-server.d.ts.map