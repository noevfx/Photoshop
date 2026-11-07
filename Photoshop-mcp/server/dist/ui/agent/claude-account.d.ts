import type { ModelMessage } from 'ai';
import type { ProviderAdapter } from '../providers/registry.js';
import { type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent } from './shared.js';
export interface RunChatViaClaudeAccountOptions {
    prompt: string;
    history: ModelMessage[];
    provider: ProviderAdapter;
    modelId: string;
    chatId?: string;
    systemPrompt: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}
export declare function runChatViaClaudeAccount(opts: RunChatViaClaudeAccountOptions): AsyncGenerator<RunChatStreamEvent>;
//# sourceMappingURL=claude-account.d.ts.map