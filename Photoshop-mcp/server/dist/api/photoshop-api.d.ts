import { PhotoshopConnection } from '../platform/connection.js';
export type APIType = 'UXP' | 'ExtendScript';
/**
 * Force the execution path regardless of detection.
 * - `uxp`: route through the UXP bridge plugin (fails fast with a clear
 *   error until the plugin supports script execution — see UXPPhotoshopAPI).
 * - `extendscript`: always use the AppleScript/COM path.
 * - `auto` (default, or any other value): use ExtendScript for script
 *   execution, and report UXP bridge status truthfully in logs.
 */
export declare const API_OVERRIDE_ENV = "PHOTOSHOP_MCP_API";
export interface PhotoshopAPI {
    /**
     * Execute a script using the appropriate API
     */
    executeScript(script: string, timeoutMs?: number, options?: {
        launch?: boolean;
    }): Promise<unknown>;
    /**
     * Get the API type being used
     */
    getAPIType(): APIType;
}
export declare class PhotoshopAPIFactory {
    private logger;
    private connection;
    constructor(connection: PhotoshopConnection);
    createAPI(): Promise<PhotoshopAPI>;
    private determineAPIType;
}
//# sourceMappingURL=photoshop-api.d.ts.map