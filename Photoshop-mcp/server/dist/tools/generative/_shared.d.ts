import type { ToolResult } from '../../core/tool-registry.js';
import { ExtendScriptSnippets } from '../../api/extendscript.js';
import type { PhotoshopConnection } from '../../platform/connection.js';
/** Generative cloud jobs may exceed the default 30s script timeout. */
export declare const GENERATIVE_SCRIPT_TIMEOUT_MS = 120000;
export declare function runGenerativeSnippet(connection: PhotoshopConnection, script: string): Promise<unknown>;
export declare function requireGenerativeCapability(connection: PhotoshopConnection, feature: 'generative_fill' | 'generative_upscale'): Promise<ToolResult | null>;
export declare function parseGenerativeResult(raw: unknown): ToolResult;
export declare function clampGenerativeScale(value: unknown): 2 | 4;
export declare const GENERATIVE_EXPAND_DIRECTIONS: readonly ["left", "right", "top", "bottom", "all"];
export type GenerativeExpandDirection = (typeof GENERATIVE_EXPAND_DIRECTIONS)[number];
export declare function normalizeExpandDirection(value: unknown): GenerativeExpandDirection;
export { ExtendScriptSnippets };
//# sourceMappingURL=_shared.d.ts.map