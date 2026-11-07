import { SdkStructuredPlanner } from './planner-sdk.js';
import { SubscriptionPlanner } from './planner-subscription.js';
export function plannerKindForAuth(authMethod) {
    return authMethod === 'cli_account' ? 'subscription' : 'sdk';
}
export function createPlanner(opts) {
    if (opts.authMethod === 'cli_account') {
        if (opts.provider.id !== 'anthropic' && opts.provider.id !== 'google') {
            throw new Error(`Action Plan subscription is not supported for ${opts.provider.id}`);
        }
        return new SubscriptionPlanner(opts);
    }
    if (!opts.apiKey) {
        throw new Error('API key is required for Action Plan in api_key mode');
    }
    return new SdkStructuredPlanner({
        provider: opts.provider,
        apiKey: opts.apiKey,
        modelId: opts.modelId,
    });
}
//# sourceMappingURL=planner.js.map