export interface ParsedPhotoshopVersion {
    major: number;
    minor: number;
    year?: number;
    raw: string;
}
export interface PhotoshopCapabilities {
    version: string;
    features: {
        select_subject_v2: boolean;
        generative_fill: boolean;
        generative_remove: boolean;
        generative_expand: boolean;
        generative_upscale: boolean;
        sky_replacement_native: boolean;
        neural_filters: boolean;
        uxp_bridge_reachable: boolean;
        execute_as_modal_timeout: boolean;
        uxp_plugin_api: boolean;
    };
}
export declare function parsePhotoshopVersion(version: string): ParsedPhotoshopVersion;
export declare function getPhotoshopCapabilities(version: string): PhotoshopCapabilities;
/**
 * Merge runtime UXP bridge reachability into version-derived capabilities.
 * `uxp_bridge_reachable` is true only when the companion plugin is actively
 * polling the bridge (not merely that the bridge HTTP server is listening),
 * so `neural_filters` reflects a plugin that can actually pick up commands.
 */
export declare function resolvePhotoshopCapabilities(version: string): Promise<PhotoshopCapabilities>;
//# sourceMappingURL=capabilities.d.ts.map