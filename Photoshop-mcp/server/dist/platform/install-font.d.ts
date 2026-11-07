/** Large enough for a variable family, small enough to reject an accidental binary. */
export declare const MAX_FONT_BYTES: number;
export interface InstalledFont {
    installedPath: string;
    postScriptNames: string[];
    family: string | null;
    alreadyInstalled: boolean;
}
/**
 * Font Book's Current User location. Fonts here are available only to this user.
 * https://support.apple.com/guide/font-book/change-font-book-settings-fntbk1004/mac
 */
export declare function userFontDirectory(): string;
/** Value name Windows stores for a per-user font, for example "Fredoka (TrueType)". */
export declare function windowsFontRegistryValueName(title: string, outline: 'TrueType' | 'OpenType'): string;
/**
 * Install a font for the current user. This only writes the OS font folder.
 * An open Photoshop session keeps its own list until Application.refreshFonts().
 */
export declare function installUserFont(filePath: string, options?: {
    destDir?: string;
}): Promise<InstalledFont>;
//# sourceMappingURL=install-font.d.ts.map