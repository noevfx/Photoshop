/**
 * Normalize values returned from ExtendScript via AppleScript stdout.
 * Objects are serialized with toSource() (e.g. "({ok:true,summary:\"...\"})"),
 * which is not valid JSON but is valid JavaScript object literal syntax.
 */
export declare function parseExtendScriptPayload(raw: unknown): unknown;
//# sourceMappingURL=extendscript-result.d.ts.map