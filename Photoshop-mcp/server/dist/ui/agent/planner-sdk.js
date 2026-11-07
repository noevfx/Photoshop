import { Output, streamText } from 'ai';
import { planSchema } from './plan-schema.js';
import { buildPlannerPrompt, buildRepairPrompt } from './plan-schema.js';
export class SdkStructuredPlanner {
    opts;
    kind = 'sdk';
    constructor(opts) {
        this.opts = opts;
    }
    async *plan(input) {
        return yield* this.streamPlan(input.systemPrompt, buildPlannerPrompt(input.catalog, input.history, input.prompt), input.abortSignal);
    }
    async *repair(input) {
        return yield* this.streamPlan(input.systemPrompt, buildRepairPrompt(input.catalog, input.originalPrompt, input.remaining, input.results, input.errorMessage), input.abortSignal);
    }
    async *streamPlan(system, prompt, abortSignal) {
        const model = this.opts.provider.getLanguageModel({
            apiKey: this.opts.apiKey,
            modelId: this.opts.modelId,
        });
        const streamed = streamText({
            model,
            output: Output.object({ schema: planSchema }),
            system,
            prompt,
            abortSignal,
        });
        for await (const partial of streamed.partialOutputStream) {
            yield { type: 'partial', plan: partial };
        }
        return {
            plan: await streamed.output,
            usage: await streamed.usage,
        };
    }
}
//# sourceMappingURL=planner-sdk.js.map