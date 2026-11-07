import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
export interface PreviewScriptPayload {
    path: string;
    width: number;
    height: number;
    mimeType: string;
    documentId?: number | string | null;
    documentName: string;
    documentWidth: number;
    documentHeight: number;
    colorMode: string;
    layers: string[];
}
export declare function parsePreviewScriptPayload(raw: unknown): PreviewScriptPayload | undefined;
export declare function buildPreviewToolResult(payload: PreviewScriptPayload, base64: string, bytes: number): CallToolResult;
//# sourceMappingURL=preview-result.d.ts.map