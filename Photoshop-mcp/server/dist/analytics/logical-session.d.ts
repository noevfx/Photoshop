/** Cursor often respawns stdio; treat activity inside this window as one session. */
export declare const MCP_LOGICAL_SESSION_IDLE_MS: number;
export interface LogicalSessionRecord {
    id: string;
    startedAt: number;
    lastSeenAt: number;
    clientName?: string;
    clientVersion?: string;
    connectCount: number;
}
export interface ClosedLogicalSession {
    durationMs: number;
    shutdownReason: 'idle_timeout';
}
export interface BeginLogicalSessionResult {
    isNew: boolean;
    session: LogicalSessionRecord;
    closedPrevious?: ClosedLogicalSession;
}
export declare function beginLogicalSession(now?: number): BeginLogicalSessionResult;
export declare function noteLogicalSessionActivity(now?: number): void;
export declare function bindLogicalSessionClient(client: {
    name?: string;
    version?: string;
}, now?: number): {
    emitConnected: boolean;
    connectCount: number;
};
export declare function getLogicalSession(): LogicalSessionRecord | null;
/** Clears in-process state so tests can switch `PHOTOSHOP_MCP_HOME`. */
export declare function resetLogicalSessionForTests(): void;
//# sourceMappingURL=logical-session.d.ts.map