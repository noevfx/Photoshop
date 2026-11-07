/** Default ExtendScript budget for atomic tools (ms). */
export declare const DEFAULT_SCRIPT_TIMEOUT_MS = 30000;
/** Floor for any caller- or env-supplied timeout. */
export declare const MIN_SCRIPT_TIMEOUT_MS = 1000;
/**
 * Ceiling advertised to tools and env. macOS AppleScript `with timeout` and
 * the Node SIGKILL bound both scale to this (see macos-executor tests).
 */
export declare const MAX_SCRIPT_TIMEOUT_MS = 600000;
/**
 * Multi-file / long recipes (batch watermark, CSV cards, mockup replace,
 * social variants, datasets, image stack, artboard export, carousel split).
 */
export declare const BATCH_SCRIPT_TIMEOUT_MS = 600000;
/** Extra time a task may sit in the serial queue before the caller gives up. */
export declare const QUEUE_WAIT_ALLOWANCE_MS = 60000;
/**
 * Suggested `timeout_ms` when `photoshop_execute_script` itself timed out.
 * MCP killing osascript/cscript does not abort JSX already running inside Photoshop.
 */
export declare const EXECUTE_SCRIPT_RETRY_TIMEOUT_MS = 180000;
/**
 * Resolve the per-call script timeout.
 * Explicit `timeoutMs` wins; otherwise `PHOTOSHOP_SCRIPT_TIMEOUT` (ms); else 30s.
 */
export declare function resolveScriptTimeoutMs(timeoutMs?: number): number;
export declare function isScriptTimeoutError(message: string): boolean;
//# sourceMappingURL=script-timeout.d.ts.map