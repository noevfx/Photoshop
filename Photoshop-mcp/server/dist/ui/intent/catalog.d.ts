/**
 * One Photoshop tool Jev may pick. The list is the registered MCP tools, not a
 * hand-written phrase book. Jev returns the tool name; code fills arguments
 * from the JSON schema (enum, number, boolean, enum array). Free text stays
 * with the planner.
 */
export type SlotSpec = {
    kind: 'choice';
    key: string;
    question: string;
    options: Record<string, string>;
} | {
    kind: 'number';
    key: string;
    question: string;
    min: number;
    max: number;
    integer?: boolean;
} | {
    kind: 'flag';
    key: string;
    question: string;
    value: unknown;
} | {
    kind: 'multi';
    key: string;
    question: string;
    options: Record<string, string>;
};
export type SlotValues = Record<string, unknown>;
export interface InstantIntent {
    /** Tool name sent to Jev; stable. */
    id: string;
    /** Short criterion. First sentence or the "Use when" line, plus the label. */
    describe: string;
    /** Chip label, e.g. "Undo". */
    label: string;
    tool: string;
    slots?: SlotSpec[];
    /** Slot keys that must be resolved before the intent can run instantly. */
    requires?: string[];
    /** Flatten, merge, delete, or close: never run without the planner. Closing drops unsaved changes outside the History panel. */
    risky?: boolean;
    /** A required argument is free text (path, prompt, copy). Jev cannot write it. */
    unfillable?: boolean;
    /** Pixels change, so fetch a preview afterwards. */
    preview?: boolean;
    args: (slots: SlotValues) => Record<string, unknown>;
    describeCall?: (slots: SlotValues) => string;
}
export declare const OTHER_INTENT = "other";
export declare const OTHER_DESCRIPTION = "Anything else: more than one change, a change that is not listed here, a question, or unclear.";
export declare function hasUnboundedQuantifier(text: string): boolean;
/**
 * Classifier criterion, not the LLM essay. Lead with the name and the phrases
 * people type ("Users often say"), then what the tool does. "Do NOT use",
 * returns and preconditions stay out.
 */
export declare function shortToolDescription(description: string, name: string): string;
export declare const INSTANT_INTENTS: readonly InstantIntent[];
export declare function findIntent(id: string): InstantIntent | undefined;
//# sourceMappingURL=catalog.d.ts.map