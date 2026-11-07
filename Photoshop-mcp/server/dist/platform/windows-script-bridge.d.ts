/** Child-process env var holding the JSX path. Kept out of the .vbs source. */
export declare const WINDOWS_JSX_ENV = "PSMCP_JSX";
/** Child-process env var holding the UTF-16 result file path. */
export declare const WINDOWS_RESULT_ENV = "PSMCP_RESULT";
/**
 * ASCII-only cscript bridge.
 *
 * cscript prints WScript.Echo with the system ANSI code page, so any non-ASCII
 * Photoshop result (and any non-ASCII temp path inlined into the .vbs file)
 * is corrupted before Node can read it. Paths travel in the process environment
 * (Unicode), and the script body is written as UTF-16 LE by FileSystemObject,
 * which ships with Windows Script Host. Stdout stays ASCII.
 */
export declare function buildWindowsBridgeScript(): string;
/** Decode a FileSystemObject Unicode text file (UTF-16 LE, BOM required). */
export declare function decodeWindowsResultFile(buffer: Buffer): string;
export declare function readWindowsResultFile(path: string): Promise<string | null>;
//# sourceMappingURL=windows-script-bridge.d.ts.map