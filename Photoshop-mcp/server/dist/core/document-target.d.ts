import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { ToolHandler } from './tool-registry.js';
/** Tools that already manage documents themselves, or never target a document. */
export declare const DOCUMENT_ID_SCHEMA_EXCLUDES: Set<string>;
/**
 * These tools create a new document. A passed id must not be resolved first:
 * with nothing open, that check rejects 0 and invented ids before the file exists.
 */
export declare const DOCUMENT_ID_GUARD_EXCLUDES: Set<string>;
export declare const DOCUMENT_ID_PROPERTY: {
    readonly type: readonly ["number", "null"];
    readonly description: string;
};
export declare function runWithDocumentId<T>(documentId: number | undefined, fn: () => T): T;
export declare function getTargetDocumentId(): number | undefined;
export declare function parseDocumentIdArg(args: Record<string, unknown> | undefined): number | undefined;
export declare function wrapDocumentIdHandler(toolName: string, handler: ToolHandler): ToolHandler;
/** Inject optional `document_id` on tools that operate against the active document. */
export declare function withOptionalDocumentId(tool: Tool): Tool;
/** ExtendScript prepended inside the execute wrapper when a target id is set. */
export declare function documentGuardScript(documentId: number): string;
//# sourceMappingURL=document-target.d.ts.map