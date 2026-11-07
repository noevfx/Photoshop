import type { ModelMessage } from 'ai';
import type { ProviderAdapter } from '../providers/registry.js';
import type { AuthMethod } from '../providers/types.js';
import { type PlanStep } from './plan-schema.js';
import { type AssistantBuffer, type RunChatFinishInfo, type RunChatStreamEvent } from './shared.js';
export interface RunChatViaActionPlanOptions {
    prompt: string;
    history: ModelMessage[];
    provider: ProviderAdapter;
    apiKey?: string;
    modelId: string;
    chatId?: string;
    cliPath?: string;
    authMethod?: AuthMethod;
    systemPrompt: string;
    abortSignal: AbortSignal;
    onAssistantBuffer?: (buf: AssistantBuffer) => void;
    onFinish?: (info: RunChatFinishInfo) => void;
}
/**
 * After a repair, failed attempts stay in the tool-call list while the plan
 * step they belonged to is replaced. Drop those attempts. A reused step id
 * only keeps a call whose tool still matches that step.
 */
export declare function pruneSupersededToolCalls<T extends {
    stepId?: string;
    name?: string;
}>(toolCalls: T[], steps: Array<{
    id: string;
    tool: string;
}>): T[];
export declare function runChatViaActionPlan(opts: RunChatViaActionPlanOptions): AsyncGenerator<RunChatStreamEvent>;
/**
 * Models often emit `"document_id":$steps.s4.document.id` and then repeat it
 * on every repair. Quote those tokens so JSON.parse can see them; resolution
 * still happens afterwards.
 */
export declare function quoteBareStepPlaceholders(argsJson: string): string;
/**
 * A get_state before create_document reports an older file. Later steps that
 * reuse that id switch Photoshop away from the document this plan just created.
 */
export declare function replaceStaleDocumentId(args: unknown, results: Record<string, unknown>, steps: PlanStep[], index: number): unknown;
export declare function resolveArgs(argsJson: string, results: Record<string, unknown>): unknown;
//# sourceMappingURL=action-plan.d.ts.map