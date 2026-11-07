/**
 * True only when the Photoshop plugin is actually polling the bridge.
 *
 * Fetching /health on our own server merely proves that this Node process
 * is listening — it says nothing about Photoshop. The health payload now
 * carries `plugin_polling`, derived from the plugin's /poll traffic (the
 * panel polls every 400ms), which is the signal that the UXP bridge panel
 * is loaded and running in Photoshop. Bridge commands would queue forever
 * without that poller, so anything that wants to *use* the bridge (e.g.
 * neural filters) must check this, not just server liveness.
 */
export declare function isUxpBridgeReachable(): Promise<boolean>;
export type NeuralFilterKind = 'skin_smoothing' | 'harmonize' | 'depth_blur' | 'super_zoom' | 'colorize';
export interface NeuralFilterParams {
    smoothness?: number;
    blur?: number;
    reference_layer_id?: number;
}
export declare function invokeNeuralFilter(filter: NeuralFilterKind, params?: NeuralFilterParams): Promise<{
    ok: boolean;
    data?: unknown;
    error?: string;
}>;
//# sourceMappingURL=uxp-bridge-client.d.ts.map