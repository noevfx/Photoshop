/**
 * In-process previous-frame cache for the preview MCP App.
 * The tool result the model sees never includes the previous JPEG.
 */
export declare const PREVIEW_APP_URI = "ui://photoshop/preview";
export declare const PREVIEW_APP_MIME = "text/html;profile=mcp-app";
export interface StoredPreviewFrame {
    documentId: string;
    base64: string;
    mimeType: string;
    width: number;
    height: number;
}
export declare function previousPreviewUri(documentId: string): string;
export declare function previousDocumentIdFromUri(uri: string): string | undefined;
export declare function previewDocumentKey(id: unknown): string | undefined;
/** Stores `frame` as the latest capture. Returns the URI of the frame it replaced. */
export declare function rememberPreviewFrame(frame: StoredPreviewFrame): string | undefined;
export declare function readPreviousPreview(documentId: string): StoredPreviewFrame | undefined;
export declare function clearPreviewFrames(): void;
//# sourceMappingURL=preview-frames.d.ts.map