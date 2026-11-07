import type { GetPromptResult, PromptArgument } from '@modelcontextprotocol/sdk/types.js';
export declare function argString(args: Record<string, string>, key: string, defaultValue: string): string;
export declare function argInt(args: Record<string, string>, key: string, defaultValue: number): number;
export declare function argBool(args: Record<string, string>, key: string, defaultValue: boolean): boolean;
export declare function argEnum<T extends string>(args: Record<string, string>, key: string, options: readonly T[], defaultValue: T): T;
export declare function argList(args: Record<string, string>, key: string, defaultValue: string[]): string[];
export declare function userPrompt(description: string, text: string): GetPromptResult;
export interface PhotoshopPromptTemplate {
    name: string;
    description: string;
    arguments: PromptArgument[];
    handler: (args: Record<string, string>) => GetPromptResult;
}
export interface PromptDefinition {
    prompt: {
        name: string;
        description?: string;
        arguments?: PromptArgument[];
    };
    handler: (args: Record<string, string>) => GetPromptResult;
}
export declare function toPromptDefinition(t: PhotoshopPromptTemplate): PromptDefinition;
//# sourceMappingURL=_shared.d.ts.map