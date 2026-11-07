export type ProviderId = 'anthropic' | 'openai' | 'openrouter' | 'google' | 'custom';
export type AuthMethod = 'api_key' | 'cli_account';
export interface ProviderConfig {
    authMethod?: AuthMethod;
    apiKey?: string;
    defaultModel?: string;
    cliPath?: string;
    cliAccountLabel?: string;
}
export interface CustomProviderConfig {
    name: string;
    websiteUrl: string;
    apiKey: string;
    baseUrl: string;
    apiFormat: 'openai' | 'anthropic';
    models: {
        id: string;
        label: string;
    }[];
    defaultModel: string;
}
/** Jev (TypeSafe) intent routing, set from Settings → Routing. */
export interface IntentRouterConfig {
    apiKey?: string;
    /** Route messages with Jev when a key is present. Defaults to on. */
    enabled?: boolean;
    /** Let Jev run single safe commands without the chat model. Defaults to on. */
    instant?: boolean;
}
export interface UIConfig {
    providers: Partial<Record<ProviderId, ProviderConfig>>;
    activeProvider: ProviderId;
    activeModel: string;
    /**
     * When enabled, a single planning LLM call produces an ordered tool plan that
     * is executed directly, instead of the per-step ReAct loop. Defaults to on.
     */
    actionPlanBeta?: boolean;
    customProvider: CustomProviderConfig | null;
    intentRouter?: IntentRouterConfig;
}
export declare function loadConfig(): UIConfig;
export declare function saveConfig(patch: Partial<UIConfig>): UIConfig;
export declare function setProviderConfig(id: ProviderId, patch: ProviderConfig): UIConfig;
export declare function getProviderConfig(id: ProviderId): ProviderConfig | undefined;
export declare function getAuthMethod(id: ProviderId): AuthMethod;
export declare function isProviderConfigAuthenticated(id: ProviderId): boolean;
export declare function maskApiKey(apiKey?: string): string | null;
export declare function saveCustomProvider(config: CustomProviderConfig): UIConfig;
export declare function getCustomProvider(): CustomProviderConfig | null;
export declare function deleteCustomProvider(): UIConfig;
export declare function getIntentRouterConfig(): IntentRouterConfig;
/** Merge into the stored router settings; `apiKey: null` removes the key. */
export declare function setIntentRouterConfig(patch: Omit<IntentRouterConfig, 'apiKey'> & {
    apiKey?: string | null;
}): IntentRouterConfig;
//# sourceMappingURL=config.d.ts.map