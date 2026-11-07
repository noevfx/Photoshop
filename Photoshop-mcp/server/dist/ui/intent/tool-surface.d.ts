export interface ToolSurface {
    name: string;
    description: string;
    inputSchema: {
        properties?: Record<string, unknown>;
        required?: string[];
    };
    /** Pixels and document state stay as they are. */
    readOnly: boolean;
}
/**
 * The same tool set the MCP server registers, without a live Photoshop
 * connection. Schemas are the raw ones (no injected document_id).
 */
export declare function listToolSurfaces(): ToolSurface[];
//# sourceMappingURL=tool-surface.d.ts.map