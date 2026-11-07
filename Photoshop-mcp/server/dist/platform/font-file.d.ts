/**
 * Read PostScript names out of a TrueType, OpenType, or collection font.
 * Name IDs follow the OpenType `name` table; named instances follow `fvar`.
 * https://learn.microsoft.com/en-us/typography/opentype/spec/name
 * https://learn.microsoft.com/en-us/typography/opentype/spec/fvar
 */
export interface FontFaceInfo {
    /** Name ID 6, plus each named instance's PostScript name when the font defines one. */
    postScriptNames: string[];
    /** Typographic family (name ID 16) or the compatible family (name ID 1). */
    family: string | null;
    /** Full name (name ID 4), used as the Windows per-user font title. */
    fullName: string | null;
}
export declare function readFontFaceInfo(data: Buffer): FontFaceInfo;
export declare function fontOutlineKind(data: Buffer, extension: string): 'TrueType' | 'OpenType';
//# sourceMappingURL=font-file.d.ts.map