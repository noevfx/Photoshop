import { ScriptExecutor } from './script-executor.js';
export { escapeForPgrep } from './macos-app.js';
/**
 * AppleScript `with timeout of N seconds` value for a given tool timeout.
 * Without this block AppleScript's default ~120s Apple-event reply timeout
 * silently caps every `do javascript` call regardless of the tool timeout.
 */
export declare function appleScriptTimeoutSeconds(timeoutMs: number): number;
/** Hard outer bound: osascript is SIGKILLed after this many ms. Always strictly
 * above the AppleScript timeout so the clean AppleEvent error fires first. */
export declare function killTimeoutMs(timeoutMs: number): number;
export declare class MacOSExecutor implements ScriptExecutor {
    private logger;
    private scriptQueue;
    private isProcessing;
    private appName;
    constructor();
    setAppName(appName: string): void;
    private appPath?;
    /** Target the detected .app bundle; a path outside a bundle keeps name targeting. */
    setAppPath(path: string): void;
    private target;
    execute(script: string, timeout?: number): Promise<unknown>;
    private processQueue;
    private executeScript;
    private createAppleScriptWrapper;
    private parseResult;
    isPhotoshopRunning(): Promise<boolean>;
    launchPhotoshop(photoshopPath: string): Promise<void>;
    /**
     * Alternative method using 'do shell script' via AppleScript
     * This can be more reliable for some versions
     */
    executeViaDoShellScript(script: string): Promise<unknown>;
}
//# sourceMappingURL=macos-executor.d.ts.map