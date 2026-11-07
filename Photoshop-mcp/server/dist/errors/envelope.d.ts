import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolHandler } from '../core/tool-registry.js';
export type PhotoshopErrorCode = 'no_active_document' | 'no_active_layer' | 'layer_not_found' | 'document_not_found' | 'ambiguous_name' | 'invalid_arguments' | 'selection_required' | 'version_unsupported' | 'generative_unavailable' | 'generative_timeout' | 'extendscript_timeout' | 'scratch_disk_full' | 'artboard_not_found' | 'generative_credits_exhausted' | 'generative_no_selection' | 'uxp_bridge_unavailable' | 'extendscript_runtime_error' | 'file_not_found' | 'font_not_found' | 'not_text_layer' | 'unsupported_color_mode' | 'no_base_layer_below' | 'not_clipping' | 'photoshop_unreachable' | 'automation_permission_denied' | 'photoshop_app_not_resolved' | 'unknown';
export interface PhotoshopErrorEnvelope {
    ok: false;
    code: PhotoshopErrorCode;
    message: string;
    suggested_next_tool?: string;
    suggested_args?: Record<string, unknown>;
}
/**
 * Photoshop's minimum available hard-disk space.
 * https://helpx.adobe.com/photoshop/system-requirements.html
 */
export declare const PHOTOSHOP_MIN_FREE_BYTES: number;
export declare function scratchDiskFullEnvelope(detail: string): PhotoshopErrorEnvelope;
/** Startup timeout while the OS drive is below Photoshop's 10 GB minimum. */
export declare function diagnoseScratchDiskTimeout(freeBytes: number | null): PhotoshopErrorEnvelope | null;
export declare function classifyError(message: string): PhotoshopErrorEnvelope;
/**
 * Timeouts are classified without knowing which tool failed. Once the wrapper
 * has the tool name, point the agent at ping (Photoshop is often still busy)
 * or at a longer execute_script retry.
 */
export declare function refineTimeoutEnvelope(toolName: string, envelope: PhotoshopErrorEnvelope): PhotoshopErrorEnvelope;
export declare function envelopeToToolResult(envelope: PhotoshopErrorEnvelope): CallToolResult;
export declare function enrichErrorResult(result: CallToolResult): CallToolResult;
export declare function buildEnvelopeFromError(error: unknown): CallToolResult;
/**
 * Photoshop freezes on "Could not initialize Photoshop because the scratch
 * disks are full" before any script can return -25010. The Apple event then
 * times out. When the OS drive is below the 10 GB minimum, say so.
 */
export declare function applyScratchDiskDiagnosis(result: CallToolResult): Promise<CallToolResult>;
export declare function wrapToolHandler(toolName: string, handler: ToolHandler): ToolHandler;
//# sourceMappingURL=envelope.d.ts.map