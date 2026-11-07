import type { ModelMessage } from 'ai';
import type { ModelPricing, UsageCost } from '../providers/registry.js';
import { type ToolImageRef } from '../store/previews.js';
export type { UsageCost, ToolImageRef };
import type { LanguageModelUsage } from 'ai';
export interface ToolResultPersist {
    ok: boolean;
    content: string;
    /** Images the tool returned (e.g. photoshop_get_preview), stored on disk. */
    images?: ToolImageRef[];
}
export interface ToolCallPersist {
    id: string;
    name: string;
    input: unknown;
    result?: ToolResultPersist;
    status: 'pending' | 'success' | 'error';
    /** Plan step this call belongs to. Repairs replace steps; the timeline matches on this id. */
    stepId?: string;
    /** Epoch ms when the call started; used to show per-step timing. */
    startedAt?: number;
    durationMs?: number;
}
export interface ToolResultEventPayload extends ToolResultPersist {
    id: string;
    durationMs?: number;
}
export type PlanStepStatus = 'pending' | 'running' | 'done' | 'error';
export interface PlanStepView {
    id: string;
    tool: string;
    rationale?: string;
    status: PlanStepStatus;
}
export interface PlanView {
    summary: string;
    steps: PlanStepView[];
}
export type StreamActivityPhase = 'planning' | 'thinking' | 'tool-running';
export interface StreamActivityPayload {
    phase: StreamActivityPhase;
    detail?: string;
}
export interface AssistantBuffer {
    text: string;
    toolCalls: ToolCallPersist[];
    reasoning?: string;
    /** Present only for Action Plan (beta) runs; persisted so it survives reload. */
    plan?: PlanView;
}
export interface RunChatStreamEvent {
    type: 'text-delta' | 'reasoning-delta' | 'activity' | 'tool-call' | 'tool-result' | 'finish' | 'error' | 'plan' | 'plan-partial' | 'plan-step' | 'plan-repair' | 'route';
    payload: unknown;
}
export interface RunChatFinishInfo {
    usage: LanguageModelUsage;
    cost?: UsageCost;
}
export declare function stringifyToolOutput(output: unknown): string;
/**
 * JSON object a later plan step can read with `$steps.<id>.<path>`.
 * MCP tool calls wrap that JSON in `{ content: [{ type: 'text', text }] }`.
 */
export declare function toolResultData(output: unknown): unknown;
/** Parse structured tool envelopes from raw MCP / SDK output. */
export declare function parseToolEnvelope(output: unknown): Record<string, unknown> | null;
/** Whether a tool output represents success (not an error envelope or MCP error flag). */
export declare function isToolOutputOk(output: unknown): boolean;
/** Prefer envelope `message` for repair / error display. */
export declare function toolFailureMessage(output: unknown, fallback: string): string;
/**
 * Record a finished tool call on the buffer and return the `tool-result` event payload.
 * Pass `output` for a normal result; pass `error` when the call threw.
 */
export declare function finishToolCall(buffer: AssistantBuffer, toolCallId: string, result: {
    output?: unknown;
    error?: string;
    chatId?: string;
    content?: string;
    ok?: boolean;
}): ToolResultEventPayload;
export declare function computeCost(usage: LanguageModelUsage, pricing: ModelPricing): UsageCost;
export declare function buildPromptWithHistory(history: ModelMessage[], prompt: string): string;
//# sourceMappingURL=shared.d.ts.map