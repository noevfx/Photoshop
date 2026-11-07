import type { LanguageModelUsage, ModelMessage } from 'ai';
import type { ProviderAdapter } from '../providers/registry.js';
import type { AuthMethod } from '../providers/types.js';
import type { Plan, PlanStep } from './plan-schema.js';
export type PlannerKind = 'sdk' | 'subscription';
export interface PlannerEvent {
    type: 'partial';
    plan: Partial<Plan>;
}
export interface PlanResult {
    plan: Plan;
    usage?: LanguageModelUsage;
}
export interface PlanInput {
    catalog: string;
    history: ModelMessage[];
    prompt: string;
    systemPrompt: string;
    abortSignal: AbortSignal;
}
export interface RepairInput {
    catalog: string;
    originalPrompt: string;
    remaining: PlanStep[];
    results: Record<string, unknown>;
    errorMessage: string;
    systemPrompt: string;
    abortSignal: AbortSignal;
}
export interface Planner {
    readonly kind: PlannerKind;
    plan(input: PlanInput): AsyncGenerator<PlannerEvent, PlanResult>;
    repair(input: RepairInput): AsyncGenerator<PlannerEvent, PlanResult>;
}
export interface CreatePlannerOptions {
    authMethod: AuthMethod;
    provider: ProviderAdapter;
    apiKey?: string;
    modelId: string;
    cliPath?: string;
}
export declare function plannerKindForAuth(authMethod: AuthMethod): PlannerKind;
export declare function createPlanner(opts: CreatePlannerOptions): Planner;
//# sourceMappingURL=planner.d.ts.map