/** Set by the UI chat runner so default exports land under ~/.photoshop-mcp/exports/<id>/. */
export declare const PHOTOSHOP_EXPORT_CHAT_ID_ENV = "PHOTOSHOP_EXPORT_CHAT_ID";
/** Set to `ui` when the standalone UI spawns this MCP as a child (skip host-tool feedback nudge). */
export declare const PHOTOSHOP_MCP_SURFACE_ENV = "PHOTOSHOP_MCP_SURFACE";
export declare function sanitizeExportChatSegment(raw: string | undefined | null): string | null;
export declare function getPhotoshopMcpHomeDir(): string;
export declare function getPhotoshopExportsDir(): string;
export declare function getPhotoshopExportsWorkingDir(): string;
/**
 * Resolve a save/export path: optional user path, default file under
 * ~/.photoshop-mcp/exports (or ~/.photoshop-mcp/exports/<chatId> in UI mode).
 */
export declare function resolveExportPath(userPath: string | undefined, ext: string): string;
//# sourceMappingURL=export-paths.d.ts.map