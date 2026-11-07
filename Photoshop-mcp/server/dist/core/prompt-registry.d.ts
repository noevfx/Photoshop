import type { GetPromptResult, Prompt } from '@modelcontextprotocol/sdk/types.js';
import type { PromptDefinition } from '../prompts/_shared.js';
export type { PromptDefinition };
export interface PromptHandler {
    (args: Record<string, string>): Promise<GetPromptResult> | GetPromptResult;
}
export declare class PromptRegistry {
    private logger;
    private prompts;
    constructor();
    register(name: string, definition: PromptDefinition): void;
    has(name: string): boolean;
    list(): Prompt[];
    get(name: string, args: Record<string, string>): Promise<GetPromptResult>;
    count(): number;
}
//# sourceMappingURL=prompt-registry.d.ts.map