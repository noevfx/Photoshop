import { anthropicAdapter } from './anthropic.js';
import { customAdapter } from './custom.js';
import { googleAdapter } from './google.js';
import { openaiAdapter } from './openai.js';
import { openrouterAdapter } from './openrouter.js';
export const providers = {
    anthropic: anthropicAdapter,
    openai: openaiAdapter,
    openrouter: openrouterAdapter,
    google: googleAdapter,
    custom: customAdapter,
};
export function getProvider(id) {
    return providers[id];
}
export function listProviders() {
    return Object.values(providers);
}
//# sourceMappingURL=registry.js.map