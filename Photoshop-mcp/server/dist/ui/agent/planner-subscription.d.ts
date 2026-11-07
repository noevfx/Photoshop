import type { ProviderAdapter } from '../providers/registry.js';
import type { PlanInput, PlanResult, Planner, PlannerEvent, PlannerKind, RepairInput } from './planner.js';
export interface SubscriptionPlannerOptions {
    provider: ProviderAdapter;
    modelId: string;
    cliPath?: string;
}
export declare class SubscriptionPlanner implements Planner {
    private readonly opts;
    readonly kind: PlannerKind;
    constructor(opts: SubscriptionPlannerOptions);
    plan(input: PlanInput): AsyncGenerator<PlannerEvent, PlanResult>;
    repair(input: RepairInput): AsyncGenerator<PlannerEvent, PlanResult>;
    private submitPlan;
    private runClaude;
    private runGemini;
}
//# sourceMappingURL=planner-subscription.d.ts.map