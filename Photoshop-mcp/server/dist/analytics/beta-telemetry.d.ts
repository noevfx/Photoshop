export interface BetaChatTurnInput {
    providerId: string;
    model: string;
    authMethod: string;
    userPrompt: string;
    assistantText: string;
    assistantReasoning?: string;
    toolNames: string[];
}
export declare function captureBetaChatTurn(input: BetaChatTurnInput): void;
//# sourceMappingURL=beta-telemetry.d.ts.map