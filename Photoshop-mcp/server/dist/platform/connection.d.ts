export interface PhotoshopInfo {
    version: string;
    path: string;
    isRunning: boolean;
    appName?: string;
}
export declare class PhotoshopConnection {
    private logger;
    private detector;
    private executor;
    private photoshopInfo;
    private macosExecutor?;
    private onFreshDetect?;
    constructor();
    /** Returns the platform executor, initializing it on first call. */
    private getExecutor;
    /** Register a listener for a real detect() — not a cache hydrate. */
    setOnFreshDetect(callback: (ok: boolean) => void): void;
    /** Load a valid on-disk detect without Spotlight/registry. */
    hydrateFromCache(): boolean;
    private notifyFreshDetect;
    private applyCachedInfo;
    private resolvePhotoshopInfo;
    ping(): Promise<boolean>;
    getVersion(): Promise<string>;
    executeScript(script: string, timeout?: number, options?: {
        launch?: boolean;
    }): Promise<unknown>;
    getPhotoshopInfo(): PhotoshopInfo | null;
    ensurePhotoshopRunning(): Promise<void>;
    /**
     * Point the macOS executor at the detected install. Must run after
     * getExecutor(): the executor is created lazily, and before this ordering fix
     * the first script of every session ran against the hard-coded default
     * ("Adobe Photoshop 2025"). The bundle path is the AppleScript target; the
     * name stays for logs and as a fallback when the path is not a bundle (#72).
     */
    private applyMacOSTarget;
}
//# sourceMappingURL=connection.d.ts.map