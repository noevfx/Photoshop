import type { ModelMessage } from 'ai';
import { z } from 'zod';
import type { PlanStepStatus, PlanView } from './shared.js';
export declare const MAX_PLAN_STEPS = 20;
export declare const planStepSchema: z.ZodObject<{
    id: z.ZodString;
    tool: z.ZodString;
    argsJson: z.ZodString;
    rationale: z.ZodString;
    dependsOn: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const planSchema: z.ZodObject<{
    summary: z.ZodString;
    steps: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        tool: z.ZodString;
        argsJson: z.ZodString;
        rationale: z.ZodString;
        dependsOn: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type PlanStep = z.infer<typeof planStepSchema>;
export type Plan = z.infer<typeof planSchema>;
export interface CatalogTool {
    description?: string;
    inputSchema?: unknown;
}
export declare function parsePlan(input: unknown): Plan;
export declare function toStepView(step: PlanStep, status: PlanStepStatus): {
    id: string;
    tool: string;
    rationale: string | undefined;
    status: PlanStepStatus;
};
export declare function toPartialPlanView(partial: Partial<Plan>): PlanView;
export declare function buildToolCatalog(tools: Record<string, CatalogTool>): string;
export declare function buildPlannerPrompt(catalog: string, history: ModelMessage[], prompt: string): string;
export declare function buildRepairPrompt(catalog: string, originalPrompt: string, remaining: PlanStep[], results: Record<string, unknown>, errorMessage: string): string;
//# sourceMappingURL=plan-schema.d.ts.map