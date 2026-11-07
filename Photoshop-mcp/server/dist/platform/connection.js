import { platform } from 'os';
import { Logger } from '../utils/logger.js';
import { PhotoshopDetector } from './detector.js';
import { readPhotoshopDetectCache, writePhotoshopDetectCache } from './detect-cache.js';
import { WindowsExecutor } from './windows-executor.js';
import { MacOSExecutor } from './macos-executor.js';
export class PhotoshopConnection {
    logger;
    detector;
    executor = null;
    photoshopInfo = null;
    macosExecutor;
    onFreshDetect;
    constructor() {
        this.logger = new Logger('PhotoshopConnection');
        this.detector = new PhotoshopDetector();
        // Executor is initialized lazily on first use so that constructing a
        // PhotoshopConnection on an unsupported platform (e.g. the Linux CI runner
        // used for the verify-photoshop-prompts script) does not throw immediately.
    }
    /** Returns the platform executor, initializing it on first call. */
    getExecutor() {
        if (this.executor)
            return this.executor;
        const platformType = platform();
        if (platformType === 'win32') {
            this.executor = new WindowsExecutor();
        }
        else if (platformType === 'darwin') {
            this.macosExecutor = new MacOSExecutor();
            this.executor = this.macosExecutor;
        }
        else {
            throw new Error(`Unsupported platform: ${platformType}`);
        }
        return this.executor;
    }
    /** Register a listener for a real detect() — not a cache hydrate. */
    setOnFreshDetect(callback) {
        this.onFreshDetect = callback;
    }
    /** Load a valid on-disk detect without Spotlight/registry. */
    hydrateFromCache() {
        if (this.photoshopInfo)
            return true;
        const cached = readPhotoshopDetectCache();
        if (!cached)
            return false;
        this.photoshopInfo = {
            version: cached.version,
            path: cached.path,
            isRunning: false,
            ...(cached.appName ? { appName: cached.appName } : {}),
        };
        this.logger.debug(`Using cached Photoshop detect at ${cached.path}`);
        return true;
    }
    notifyFreshDetect(ok) {
        this.onFreshDetect?.(ok);
    }
    applyCachedInfo(cached) {
        this.photoshopInfo = {
            version: cached.version,
            path: cached.path,
            isRunning: false,
            ...(cached.appName ? { appName: cached.appName } : {}),
        };
    }
    async resolvePhotoshopInfo() {
        if (this.photoshopInfo)
            return this.photoshopInfo;
        const cached = readPhotoshopDetectCache();
        if (cached) {
            this.applyCachedInfo(cached);
            return this.photoshopInfo;
        }
        try {
            this.photoshopInfo = await this.detector.detect();
            if (this.photoshopInfo) {
                writePhotoshopDetectCache({
                    version: this.photoshopInfo.version,
                    path: this.photoshopInfo.path,
                    appName: this.photoshopInfo.appName,
                });
                this.notifyFreshDetect(true);
                return this.photoshopInfo;
            }
            this.notifyFreshDetect(false);
            return null;
        }
        catch (error) {
            this.notifyFreshDetect(false);
            throw error;
        }
    }
    async ping() {
        try {
            this.logger.debug('Pinging Photoshop...');
            const info = await this.resolvePhotoshopInfo();
            return info !== null;
        }
        catch (error) {
            this.logger.error('Ping failed:', error);
            return false;
        }
    }
    async getVersion() {
        try {
            const info = await this.resolvePhotoshopInfo();
            return info?.version || 'Unknown';
        }
        catch (error) {
            this.logger.error('Failed to get version:', error);
            throw error;
        }
    }
    async executeScript(script, timeout, options) {
        try {
            await this.resolvePhotoshopInfo();
            if (!this.photoshopInfo) {
                throw new Error('Photoshop not found on this system');
            }
            const executor = this.getExecutor();
            this.applyMacOSTarget();
            const isRunning = await executor.isPhotoshopRunning();
            if (!isRunning) {
                if (options?.launch === false) {
                    throw new Error('Photoshop is not running');
                }
                this.logger.info('Photoshop not running, launching...');
                await executor.launchPhotoshop(this.photoshopInfo.path);
            }
            const result = await executor.execute(script, timeout);
            return result;
        }
        catch (error) {
            this.logger.error('Script execution failed:', error);
            throw error;
        }
    }
    getPhotoshopInfo() {
        return this.photoshopInfo;
    }
    async ensurePhotoshopRunning() {
        await this.resolvePhotoshopInfo();
        if (!this.photoshopInfo) {
            throw new Error('Photoshop not found on this system');
        }
        const executor = this.getExecutor();
        this.applyMacOSTarget();
        const isRunning = await executor.isPhotoshopRunning();
        if (!isRunning) {
            this.logger.info('Launching Photoshop...');
            await executor.launchPhotoshop(this.photoshopInfo.path);
        }
    }
    /**
     * Point the macOS executor at the detected install. Must run after
     * getExecutor(): the executor is created lazily, and before this ordering fix
     * the first script of every session ran against the hard-coded default
     * ("Adobe Photoshop 2025"). The bundle path is the AppleScript target; the
     * name stays for logs and as a fallback when the path is not a bundle (#72).
     */
    applyMacOSTarget() {
        if (!this.macosExecutor || !this.photoshopInfo)
            return;
        if (this.photoshopInfo.appName)
            this.macosExecutor.setAppName(this.photoshopInfo.appName);
        this.macosExecutor.setAppPath(this.photoshopInfo.path);
    }
}
//# sourceMappingURL=connection.js.map