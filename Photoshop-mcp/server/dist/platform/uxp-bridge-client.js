/**
 * Client for the MCP-hosted UXP bridge (health check + neural filter invoke).
 */
import { ensureUxpBridgeServer, invokeUxpBridge } from './uxp-bridge-server.js';
const HEALTH_TIMEOUT_MS = 800;
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
export async function isUxpBridgeReachable() {
    try {
        const port = await ensureUxpBridgeServer();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
        const res = await fetch(`http://127.0.0.1:${port}/health`, {
            signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok)
            return false;
        const body = (await res.json());
        return body.ok === true && body.plugin_polling === true;
    }
    catch {
        return false;
    }
}
export async function invokeNeuralFilter(filter, params = {}) {
    const result = await invokeUxpBridge('neural_filter', { filter, ...params }, 90_000);
    if (!result.ok) {
        return { ok: false, error: result.error ?? 'neural_filter_failed' };
    }
    return { ok: true, data: result.data };
}
//# sourceMappingURL=uxp-bridge-client.js.map