/** What AppleScript and pgrep need to address one installed Photoshop. */
export interface MacAppTarget {
    /** Bundle display name, e.g. "Adobe Photoshop 2026". Fallback target and log label. */
    appName: string;
    /** Full .app bundle path when known. Preferred: it names exactly one install. */
    appPath?: string;
}
export type CommandRunner = (file: string, args: string[]) => Promise<{
    stdout: string;
}>;
/** Escape a string for use as a pgrep -f pattern (extended regex). */
export declare function escapeForPgrep(value: string): string;
/** Quote a value as an AppleScript string literal. */
export declare function appleScriptString(value: string): string;
/**
 * The .app bundle that contains `path`, or undefined when `path` is not inside
 * one. PHOTOSHOP_PATH may name the bundle, the bundle with a trailing slash, or
 * the executable under Contents/MacOS.
 */
export declare function bundlePathOf(path: string): string | undefined;
/**
 * `application "<bundle path>"`, or by name when no path is known. A path names
 * exactly the detected install (2025, 2026 and Beta share com.adobe.Photoshop)
 * and does not depend on Launch Services resolving the display name (#72).
 */
export declare function appleScriptAppRef(target: MacAppTarget): string;
/**
 * pgrep -f pattern for the app's own executable. Anchored at the start of the
 * command line: AdobeIPCBroker carries the Photoshop executable path in its
 * arguments, so an unanchored match reports a closed Photoshop as running.
 */
export declare function executablePgrepPattern(appPath: string): string;
/**
 * Whether this exact install is running. An anchored pgrep comes first: it
 * matches only this bundle's executable, while AppleScript may answer for any
 * running copy because 2025, 2026 and Beta share com.adobe.Photoshop. When
 * pgrep cannot read the process list (exit 3 inside an agent sandbox),
 * AppleScript answers instead: `running` never launches the app.
 */
export declare function isMacAppRunning(target: MacAppTarget, run?: CommandRunner): Promise<boolean>;
//# sourceMappingURL=macos-app.d.ts.map