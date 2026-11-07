const DEFAULT_RYBBIT_HOST = 'https://hey.sideguard.io';
const DEFAULT_RYBBIT_SITE_ID = '5e488c650441';
function envTruthy(name) {
    const value = process.env[name]?.trim().toLowerCase();
    return value === '1' || value === 'true' || value === 'yes';
}
/** Legacy alias for ANALYTICS_DISABLED. */
export function isPostHogDisabledByEnv() {
    return envTruthy('POSTHOG_DISABLED');
}
export function isAnalyticsDisabledByEnv() {
    return envTruthy('ANALYTICS_DISABLED') || isPostHogDisabledByEnv();
}
export function resolveRybbitHost() {
    return (process.env.RYBBIT_HOST?.trim() || DEFAULT_RYBBIT_HOST).replace(/\/$/, '');
}
export function resolveRybbitAnalyticsHost() {
    return `${resolveRybbitHost()}/api`;
}
export function resolveRybbitSiteId() {
    return process.env.RYBBIT_SITE_ID?.trim() || DEFAULT_RYBBIT_SITE_ID;
}
export function resolveRybbitApiKey() {
    const key = process.env.RYBBIT_API_KEY?.trim();
    return key || undefined;
}
export function hasAnalyticsKey() {
    return resolveRybbitSiteId().length > 0;
}
//# sourceMappingURL=config.js.map