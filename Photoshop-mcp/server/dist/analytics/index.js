import { captureBetaChatTurn } from './beta-telemetry.js';
import { getAppVersion } from './app-version.js';
import { hasAnalyticsKey, resolveRybbitAnalyticsHost, resolveRybbitSiteId } from './config.js';
import { buildPersonIdentifyProperties, buildRuntimeProperties } from './events.js';
import { rememberPhotoshopVersion } from './runtime-env.js';
import { applyInstallCohortPersonOnce } from './install-cohorts.js';
import { getBetaTelemetryState, getOrCreateDistinctId, isAnalyticsEnabled, recordUsageSurface, setBetaTelemetryChoice, } from './identity.js';
import { onMcpClientConnected, onMcpClientDisconnected } from './mcp-client.js';
import { captureMcpPageleave, captureMcpPageview, endMcpAnalyticsSession, recordMcpPromptRequest, recordMcpToolCall, startLogicalMcpAnalyticsSession, startMcpAnalyticsSession, } from './mcp-session.js';
import { getAnalytics, resetAnalyticsProvider, shutdownAnalyticsClient } from './provider.js';
/** Persist the install ID and register one anonymous analytics person per process. */
export function ensureAnalyticsIdentity() {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    getOrCreateDistinctId();
    getAnalytics();
}
export function capture(name, properties, options) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    getAnalytics().capture({
        name,
        properties: buildRuntimeProperties(properties),
        insertId: options?.insertId,
    });
}
export function identifyAnalyticsPerson(properties) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    const props = { ...(properties ?? {}) };
    if (typeof props.photoshop_version === 'string') {
        rememberPhotoshopVersion(props.photoshop_version);
    }
    const usageSurface = typeof props.usage_surface === 'string' ? props.usage_surface : undefined;
    if (usageSurface) {
        props.usage_surfaces = recordUsageSurface(usageSurface);
        delete props.usage_surface;
    }
    applyInstallCohortPersonOnce({
        ...(usageSurface ? { usageSurface } : {}),
        ...(typeof props.mcp_client_name === 'string' ? { mcpClientName: props.mcp_client_name } : {}),
    });
    getAnalytics().identify(buildPersonIdentifyProperties(props));
}
/** Refresh the anonymous person profile when Photoshop version becomes known. */
export function identifyPhotoshopVersion(version) {
    if (!version || version === 'Unknown')
        return;
    identifyAnalyticsPerson({ photoshop_version: version });
}
/** Record standalone UI provider/model choice on the person profile (no prompt content). */
export function identifyUiModelSelection(providerId, model) {
    identifyAnalyticsPerson({
        usage_surface: 'server',
        active_provider: providerId,
        active_model: model,
        last_active_at: Date.now(),
    });
    capture('ui_model_selected', {
        provider_id: providerId,
        model,
        event_source: 'server',
    });
}
export async function shutdownAnalytics() {
    await shutdownAnalyticsClient();
}
export function getAnalyticsRuntimeConfig() {
    const enabled = isAnalyticsEnabled() && hasAnalyticsKey();
    const beta = getBetaTelemetryState();
    return {
        enabled,
        provider: 'rybbit',
        siteId: resolveRybbitSiteId(),
        analyticsHost: resolveRybbitAnalyticsHost(),
        distinctId: getOrCreateDistinctId(),
        betaTelemetryOptIn: beta.betaTelemetryOptIn,
        betaTelemetryPromptAnswered: beta.betaTelemetryPromptAnswered,
    };
}
export { captureAnalyticsMilestoneOnce } from './milestones.js';
export { captureBetaChatTurn, captureMcpPageleave, captureMcpPageview, endMcpAnalyticsSession, getAnalytics, getAppVersion, getBetaTelemetryState, onMcpClientConnected, onMcpClientDisconnected, recordMcpPromptRequest, recordMcpToolCall, resetAnalyticsProvider, setBetaTelemetryChoice, startLogicalMcpAnalyticsSession, startMcpAnalyticsSession, };
//# sourceMappingURL=index.js.map