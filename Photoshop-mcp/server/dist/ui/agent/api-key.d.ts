import type { ProviderAdapter } from '../providers/registry.js';
import type { AuthMethod } from '../providers/types.js';
import type { ModelMessage } from 'ai';
import { type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent } from './shared.js';
export interface RunChatViaApiKeyOptions {
    prompt: string;
    history: ModelMessage[];
    provider: ProviderAdapter;
    apiKey: string;
    modelId: string;
    chatId?: string;
    authMethod?: AuthMethod;
    systemPrompt: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}
export declare function runChatViaApiKey(opts: RunChatViaApiKeyOptions): AsyncGenerator<RunChatStreamEvent>;
//# sourceMappingURL=api-key.d.ts.map