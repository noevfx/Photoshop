import { kvGet, kvSet } from './store/kv.js';
const KV_KEY = 'config';
const DEFAULT_CONFIG = {
    providers: {},
    activeProvider: 'anthropic',
    activeModel: 'claude-sonnet-5',
    actionPlanBeta: true,
    customProvider: null,
};
export function loadConfig() {
    const stored = kvGet(KV_KEY);
    if (!stored)
        return { ...DEFAULT_CONFIG, providers: {} };
    return {
        ...DEFAULT_CONFIG,
        ...stored,
        providers: { ...stored.providers },
        customProvider: stored.customProvider ?? null,
    };
}
export function saveConfig(patch) {
    const current = loadConfig();
    const next = {
        ...current,
        ...patch,
        providers: { ...current.providers, ...(patch.providers ?? {}) },
        customProvider: patch.customProvider !== undefined ? patch.customProvider : current.customProvider,
    };
    kvSet(KV_KEY, next);
    return next;
}
export function setProviderConfig(id, patch) {
    const current = loadConfig();
    const merged = { ...current.providers[id], ...patch };
    return saveConfig({
        providers: { ...current.providers, [id]: merged },
    });
}
export function getProviderConfig(id) {
    return loadConfig().providers[id];
}
export function getAuthMethod(id) {
    return getProviderConfig(id)?.authMethod ?? 'api_key';
}
export function isProviderConfigAuthenticated(id) {
    const cfg = getProviderConfig(id);
    const authMethod = cfg?.authMethod ?? 'api_key';
    if (authMethod === 'api_key')
        return Boolean(cfg?.apiKey);
    return Boolean(cfg?.cliAccountLabel);
}
export function maskApiKey(apiKey) {
    if (!apiKey)
        return null;
    if (apiKey.length <= 12)
        return '***';
    return `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`;
}
export function saveCustomProvider(config) {
    return saveConfig({ customProvider: config });
}
export function getCustomProvider() {
    return loadConfig().customProvider;
}
export function deleteCustomProvider() {
    return saveConfig({ customProvider: null });
}
export function getIntentRouterConfig() {
    return { ...loadConfig().intentRouter };
}
/** Merge into the stored router settings; `apiKey: null` removes the key. */
export function setIntentRouterConfig(patch) {
    const next = { ...getIntentRouterConfig() };
    if (patch.apiKey === null)
        delete next.apiKey;
    else if (typeof patch.apiKey === 'string')
        next.apiKey = patch.apiKey;
    if (typeof patch.enabled === 'boolean')
        next.enabled = patch.enabled;
    if (typeof patch.instant === 'boolean')
        next.instant = patch.instant;
    saveConfig({ intentRouter: next });
    return next;
}
//# sourceMappingURL=config.js.map