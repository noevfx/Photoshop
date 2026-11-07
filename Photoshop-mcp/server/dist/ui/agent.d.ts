import type { LanguageModelUsage, ModelMessage } from 'ai';
import type { AuthMethod } from './providers/types.js';
import type { ProviderAdapter } from './providers/registry.js';
import { computeCost, type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent, type ToolCallPersist, type UsageCost } from './agent/shared.js';
export type { AssistantBuffer, RunChatFinishInfo, RunChatStreamEvent, ToolCallPersist, UsageCost };
export { computeCost };
export interface RunChatOptions {
    prompt: string;
    history: ModelMessage[];
    provider: ProviderAdapter;
    authMethod?: AuthMethod;
    apiKey?: string;
    modelId: string;
    chatId?: string;
    cliPath?: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}
export declare const PHOTOSHOP_SYSTEM_PROMPT: string;
export declare const ACTION_PLAN_SYSTEM_PROMPT: string;
export declare function runChat(opts: RunChatOptions): AsyncGenerator<RunChatStreamEvent>;
export declare function buildHistory(messages: Array<{
    role: 'user' | 'assistant';
    content: {
        text: string;
    };
}>): ModelMessage[];
export type { LanguageModelUsage };
//# sourceMappingURL=agent.d.ts.map