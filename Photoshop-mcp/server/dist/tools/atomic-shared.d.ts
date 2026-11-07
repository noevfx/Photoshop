import { ToolResult } from '../core/tool-registry.js';
import { PhotoshopConnection } from '../platform/connection.js';
import { type PhotoshopErrorEnvelope } from '../errors/envelope.js';
export interface AtomicSuccess {
    ok: true;
    summary: string;
    details?: Record<string, unknown>;
    next_suggested_tool?: string;
}
export declare function runSnippet(connection: PhotoshopConnection, script: string, timeoutMs?: number): Promise<unknown>;
export declare function parseSnippetResult(raw: unknown): Record<string, unknown> | null;
export declare function atomicSuccess(summary: string, details?: Record<string, unknown>, nextSuggestedTool?: string): ToolResult;
export declare function atomicFailure(envelope: PhotoshopErrorEnvelope): ToolResult;
export declare function atomicFailureFromError(error: unknown, overrides?: Partial<Pick<PhotoshopErrorEnvelope, 'code' | 'message' | 'suggested_next_tool'>>): ToolResult;
//# sourceMappingURL=atomic-shared.d.ts.map