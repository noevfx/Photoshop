import type { Tool, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js';
/**
 * MCP tool annotations advertised on tools/list.
 * readOnlyHint is true only when the tool does not change Photoshop, the filesystem, or local config.
 * destructiveHint is true when the call can destroy pixels, layers, or the current history state.
 * idempotentHint is true when the same arguments leave the document in the same state on a second call.
 * openWorldHint is true when the call can reach the network or run arbitrary code.
 */
export type PhotoshopToolAnnotations = Required<Pick<ToolAnnotations, 'readOnlyHint' | 'destructiveHint' | 'idempotentHint' | 'openWorldHint'>>;
export declare const TOOL_ANNOTATIONS: Record<string, PhotoshopToolAnnotations>;
export declare function withToolAnnotations(tool: Tool): Tool;
//# sourceMappingURL=tool-annotations.d.ts.map