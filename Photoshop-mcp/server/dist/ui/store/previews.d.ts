/**
 * Images returned by tools (today: photoshop_get_preview) are written to
 * ~/.photoshop-mcp/previews/<chatId>/ instead of the chat JSON, so chat rows
 * stay small and the browser can load them lazily through /api.
 */
export interface ToolImageRef {
    /** File name inside the chat's preview folder. */
    file: string;
    mimeType: string;
}
interface RawImage {
    data: string;
    mimeType: string;
}
/** Find image content blocks in any tool-output shape we receive (MCP, AI SDK, Agent SDK). */
export declare function extractToolImages(output: unknown, depth?: number): RawImage[];
/**
 * Persist any images in a tool output and return lightweight references.
 * Never throws: a preview that cannot be stored must not fail the tool call.
 */
export declare function persistToolImages(chatId: string | undefined, toolCallId: string, output: unknown): ToolImageRef[];
export declare function readPreviewImage(chatId: string, file: string): {
    bytes: Buffer;
    mimeType: string;
} | null;
export declare function deletePreviewImages(chatId: string): void;
export {};
//# sourceMappingURL=previews.d.ts.map