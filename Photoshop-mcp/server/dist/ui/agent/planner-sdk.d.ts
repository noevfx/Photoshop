import type { ProviderAdapter } from '../providers/registry.js';
import type { PlanInput, PlanResult, Planner, PlannerEvent, PlannerKind, RepairInput } from './planner.js';
export interface SdkStructuredPlannerOptions {
    provider: ProviderAdapter;
    apiKey: string;
    modelId: string;
}
export declare class SdkStructuredPlanner implements Planner {
    private readonly opts;
    readonly kind: PlannerKind;
    constructor(opts: SdkStructuredPlannerOptions);
    plan(input: PlanInput): AsyncGenerator<PlannerEvent, PlanResult>;
    repair(input: RepairInput): AsyncGenerator<PlannerEvent, PlanResult>;
    private streamPlan;
}
//# sourceMappingURL=planner-sdk.d.ts.map