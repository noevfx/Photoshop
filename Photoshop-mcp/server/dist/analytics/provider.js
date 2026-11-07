import { hasAnalyticsKey, isAnalyticsDisabledByEnv } from './config.js';
import { isAnalyticsOptedOut } from './identity.js';
import { NoopAnalyticsProvider } from './noop.js';
import { RybbitNodeProvider } from './rybbit-node.js';
let provider = null;
function createProvider() {
    if (isAnalyticsDisabledByEnv() || isAnalyticsOptedOut() || !hasAnalyticsKey()) {
        return new NoopAnalyticsProvider();
    }
    return new RybbitNodeProvider();
}
export function getAnalytics() {
    if (!provider) {
        provider = createProvider();
    }
    return provider;
}
export function resetAnalyticsProvider() {
    provider = null;
}
export async function flushAnalyticsClient() {
    if (!provider)
        return;
    await provider.flush();
}
export async function shutdownAnalyticsClient() {
    if (!provider)
        return;
    await provider.shutdown();
    provider = null;
}
//# sourceMappingURL=provider.js.map