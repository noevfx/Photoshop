import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
export declare const FEEDBACK_NUDGE_COOLDOWN_MS: number;
export declare const FEEDBACK_NUDGE_MIN_AGE_MS: number;
export declare const FEEDBACK_SUGGESTION_MAX_CHARS = 200;
export declare const FEEDBACK_NUDGE_MARKER = "FEEDBACK_NUDGE";
export declare const FEEDBACK_NUDGE_ENV = "PSMCP_FEEDBACK";
export declare const FEEDBACK_NUDGE_QUESTION_EN = "I can make this MCP faster and more useful for you. Tell me a problem you've hit or a feature you want.";
export declare const FEEDBACK_NUDGE_QUESTION_TR = "Sizin i\u00E7in bu MCP'yi daha h\u0131zl\u0131 ve kullan\u0131\u015Fl\u0131 hale getirebilirim. Sorun ya\u015Fad\u0131\u011F\u0131n\u0131z veya olmas\u0131n\u0131 istedi\u011Finiz bir \u00F6zellik s\u00F6yleyin.";
export declare const FEEDBACK_NUDGE_LANGUAGE_RULE = "MUST ask the user in the language they are using in this conversation. Detect it from their messages; if mixed, use their latest message. Never default to English. Translate Q1 into that language and show only that translation. English and Turkish below are meaning-only examples \u2014 do not paste them unless the user is actually speaking that language.";
export declare const PING_CONNECTED_TEXT = "Successfully connected to Photoshop";
export declare const PING_FAILED_TEXT = "Failed to connect to Photoshop";
export declare const PING_NOT_FOUND_REASON = "Photoshop was not found. Set PHOTOSHOP_PATH to the Photoshop app (macOS: the .app bundle, Windows: Photoshop.exe), then restart the MCP server.";
export declare const PING_NOT_RUNNING_REASON = "Photoshop is not running. Open Photoshop, wait until it finishes starting, then call photoshop_ping again. Ping never launches Photoshop.";
export type FeedbackChoice = 'yes' | 'not_now' | 'dont_ask';
export type FeedbackNudgeStatus = 'shown' | 'yes' | 'dont_ask';
export interface FeedbackNudgeStore {
    status?: FeedbackNudgeStatus;
    firstSeenAt?: number;
    lastShownAt?: number;
    submittedAt?: number;
    choice?: FeedbackChoice;
}
export declare function isUiMcpSurface(env?: NodeJS.ProcessEnv): boolean;
/** Product-feedback ping nudge is on by default. Set `PSMCP_FEEDBACK=0` to disable. */
export declare function isFeedbackNudgeEnabled(env?: NodeJS.ProcessEnv): boolean;
export declare function truncateFeedbackSuggestion(value: string | undefined): string | undefined;
export declare function isFeedbackNudgeDue(now?: number): boolean;
/** Stamp the first successful ping; later pings keep the original timestamp. */
export declare function markFeedbackFirstSeen(now?: number): void;
export declare function markFeedbackNudgeShown(now?: number): void;
export declare function recordFeedback(choice: FeedbackChoice, suggestion?: string): {
    recorded: true;
    choice: FeedbackChoice;
    has_suggestion: boolean;
};
export declare function buildFeedbackNudgeBlock(): string;
/**
 * First text block is always the connection string so existing ping clients keep working.
 * A connected ping carries at most one extra block: UPDATE_AVAILABLE wins, and a due
 * FEEDBACK_NUDGE waits for a later ping (its cooldown is not started).
 */
export declare function buildPingToolResult(connected: boolean, now?: number): CallToolResult;
export declare function submitFeedbackFromArgs(args: Record<string, unknown>): CallToolResult;
/** Failed ping: PING_FAILED_TEXT stays the first block so existing clients still match it. */
export declare function buildPingFailureResult(reason: string): CallToolResult;
//# sourceMappingURL=nudge.d.ts.map