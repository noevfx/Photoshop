import { type Plan } from './plan-schema.js';
export declare const SUBMIT_ACTION_PLAN_TOOL = "submit_action_plan";
export declare const PLAN_OUT_PATH_ENV = "PSMCP_PLAN_OUT_PATH";
export declare const PLANNER_MCP_SERVER_NAME = "planner";
export declare const SUBMIT_ACTION_PLAN_ALLOWED_TOOLS: readonly ["mcp__planner__submit_action_plan", "submit_action_plan"];
export declare const SUBMIT_ACTION_PLAN_INPUT_SCHEMA: {
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["summary", "steps"];
    readonly properties: {
        readonly summary: {
            readonly type: "string";
            readonly description: "One short sentence summarizing the overall plan.";
        };
        readonly steps: {
            readonly type: "array";
            readonly maxItems: 20;
            readonly items: {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "tool", "argsJson", "rationale", "dependsOn"];
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "Unique short id for this step, e.g. \"s1\".";
                    };
                    readonly tool: {
                        readonly type: "string";
                        readonly description: "Exact tool name from the catalog.";
                    };
                    readonly argsJson: {
                        readonly type: "string";
                        readonly description: string;
                    };
                    readonly rationale: {
                        readonly type: "string";
                        readonly description: "One short sentence on why this step. Use \"\" if none.";
                    };
                    readonly dependsOn: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly description: "Step ids this step depends on. Use [] if none.";
                    };
                };
            };
        };
    };
};
export declare function persistSubmittedPlan(args: unknown, outPath: string): Promise<{
    ok: true;
    plan: Plan;
} | {
    ok: false;
    error: string;
}>;
export declare function isSubmitActionPlanTool(name: string | undefined): boolean;
//# sourceMappingURL=planner-submit.d.ts.map