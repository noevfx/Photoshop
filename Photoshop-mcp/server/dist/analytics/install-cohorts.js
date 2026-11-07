import { hasAnalyticsKey } from './config.js';
import { isAnalyticsEnabled } from './identity.js';
import { getAnalytics } from './provider.js';
/** Maps internal usage_surface values to install-cohort person properties. */
export function normalizeInstallUsageSurface(surface) {
    if (surface === 'ui' || surface === 'web')
        return 'web';
    if (surface === 'mcp' || surface === 'server')
        return surface;
    return 'server';
}
/**
 * Install-cohort fields — safe to call repeatedly.
 * See docs/anonymous-usage-analytics.md (person profile cohorts).
 */
export function applyInstallCohortPersonOnce(params) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    const once = {
        first_install_at: new Date().toISOString(),
    };
    if (params.usageSurface) {
        once.first_usage_surface = normalizeInstallUsageSurface(params.usageSurface);
    }
    if (params.mcpClientName?.trim()) {
        once.first_mcp_client_name = params.mcpClientName.trim();
    }
    getAnalytics().setPersonOnce(once);
}
//# sourceMappingURL=install-cohorts.js.map