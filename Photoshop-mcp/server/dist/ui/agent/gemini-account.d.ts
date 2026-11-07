import type { ModelMessage } from 'ai';
import { type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent } from './shared.js';
export interface RunChatViaGeminiAccountOptions {
    prompt: string;
    history: ModelMessage[];
    modelId: string;
    chatId?: string;
    cliPath?: string;
    systemPrompt: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}
export declare function runChatViaGeminiAccount(opts: RunChatViaGeminiAccountOptions): AsyncGenerator<RunChatStreamEvent>;
//# sourceMappingURL=gemini-account.d.ts.map