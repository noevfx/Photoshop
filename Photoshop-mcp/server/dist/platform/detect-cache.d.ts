/** Reuse a successful detect across stdio respawns; path is re-checked on read. */
export declare const PHOTOSHOP_DETECT_CACHE_TTL_MS: number;
export interface PhotoshopDetectCacheRecord {
    version: string;
    path: string;
    appName?: string;
    detectedAt: number;
}
export declare function readPhotoshopDetectCache(now?: number): PhotoshopDetectCacheRecord | null;
export declare function writePhotoshopDetectCache(info: {
    version: string;
    path: string;
    appName?: string;
}, now?: number): void;
export declare function clearPhotoshopDetectCacheForTests(): void;
//# sourceMappingURL=detect-cache.d.ts.map