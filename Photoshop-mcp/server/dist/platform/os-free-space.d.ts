/**
 * Volume Photoshop uses as the scratch disk unless the user picked another one.
 * Adobe: by default the internal OS drive (Macintosh HD / C:).
 * https://helpx.adobe.com/photoshop/kb/troubleshoot-scratch-disk-is-full-challenger.html
 */
export declare function osDrivePath(): string;
/** Bytes available to unprivileged writers, or null when the volume cannot be read. */
export declare function readOsDriveFreeBytes(): Promise<number | null>;
//# sourceMappingURL=os-free-space.d.ts.map