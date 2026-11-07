export declare const IS_DEV_SOURCE: boolean;
export declare function buildSpawnArgs(): string[];
export declare function buildPlannerSpawnArgs(): string[];
export declare function sanitizedEnv(): Record<string, string>;
/** Env for the MCP child spawned by the standalone UI (skips the host-tool feedback nudge). */
export declare function buildUiMcpChildEnv(chatId?: string): Record<string, string>;
export declare function buildMcpServerConfig(chatId?: string): {
    command: string;
    args: string[];
    env: Record<string, string>;
};
export declare function buildPlannerMcpServerConfig(planOutPath: string): {
    command: string;
    args: string[];
    env: Record<string, string>;
};
//# sourceMappingURL=mcp-transport.d.ts.map