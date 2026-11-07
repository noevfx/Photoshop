import type { LanguageModelUsage } from 'ai';
import type { UsageCost } from '../providers/registry.js';
export interface ChatRow {
    id: string;
    title: string;
    provider: string;
    model: string;
    sessionId: string | null;
    createdAt: number;
    updatedAt: number;
}
export interface MessageContent {
    text: string;
    toolCalls: Array<{
        id: string;
        name: string;
        input: unknown;
        result?: {
            ok: boolean;
            content: string;
            images?: Array<{
                file: string;
                mimeType: string;
            }>;
        };
        status: 'pending' | 'success' | 'error';
        startedAt?: number;
        durationMs?: number;
    }>;
    usage?: LanguageModelUsage;
    cost?: UsageCost;
    provider?: string;
    model?: string;
    reasoning?: string;
    /** Jev routing decision for this turn, when the intent router is on. */
    route?: {
        route: 'instant' | 'plan' | 'agent' | 'clarify';
        label: string;
        intent: string;
        confidence: number;
        latencyMs: number;
        model: string;
        reason: string;
        signals?: {
            multiStep: number;
            needsVisual: number;
            actionable: number;
        };
        steps?: number;
    };
    /** Present only for Action Plan (beta) runs. */
    plan?: {
        summary: string;
        steps: Array<{
            id: string;
            tool: string;
            rationale?: string;
            status: 'pending' | 'running' | 'done' | 'error';
        }>;
    };
}
export interface MessageRow {
    id: string;
    chatId: string;
    role: 'user' | 'assistant';
    content: MessageContent;
    createdAt: number;
}
export declare function listChats(): ChatRow[];
export declare function getChat(id: string): ChatRow | null;
export declare function getMessages(chatId: string): MessageRow[];
export declare function createChat(input: {
    provider: string;
    model: string;
    title?: string;
}): ChatRow;
export declare function appendMessage(input: {
    chatId: string;
    role: 'user' | 'assistant';
    content: MessageContent;
}): MessageRow;
export declare function renameChat(id: string, title: string): void;
export declare function updateChatModel(id: string, provider: string, model: string): void;
export declare function deleteChat(id: string): void;
export declare function setChatSessionId(id: string, sessionId: string | null): void;
//# sourceMappingURL=chats.d.ts.map