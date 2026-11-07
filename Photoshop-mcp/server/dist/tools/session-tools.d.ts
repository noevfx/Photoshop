import type { ToolDefinition, ToolHandler } from '../core/tool-registry.js';
/**
 * Tools registered on the server before a Photoshop connection exists.
 * The intent router reads the same definitions, so Jev's choices stay in
 * lockstep with tools/list.
 */
export declare function createSessionTools(handlers: {
    ping: ToolHandler;
    feedback: ToolHandler;
    version: ToolHandler;
}): ToolDefinition[];
//# sourceMappingURL=session-tools.d.ts.map