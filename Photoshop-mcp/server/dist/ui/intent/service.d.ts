import { type IntentRouterConfig } from '../config.js';
import { type IntentDecision, type IntentRoute, type IntentSignals } from './router.js';
type Env = Record<string, string | undefined>;
export type KeySource = 'settings' | 'env' | null;
export interface IntentRouterStatus {
    /** Routing will run for the next message. */
    active: boolean;
    enabled: boolean;
    instant: boolean;
    hasApiKey: boolean;
    apiKeyMasked: string | null;
    source: KeySource;
    /** PSMCP_INTENT_ROUTER=off forces routing off regardless of settings. */
    disabledByEnv: boolean;
}
export declare function resolveApiKey(cfg: IntentRouterConfig, env: Env): {
    key?: string;
    source: KeySource;
};
export declare function computeStatus(cfg: IntentRouterConfig, env: Env): IntentRouterStatus;
export declare function getIntentRouterStatus(): IntentRouterStatus;
export declare function isIntentRouterEnabled(): boolean;
/** With instant commands switched off, a would-be instant route goes through a plan. */
export declare function applyInstantSetting(decision: IntentDecision, instantAllowed: boolean): IntentDecision;
/** Drop the cached client and decisions, e.g. after the key or settings change. */
export declare function resetIntentRouter(): void;
/**
 * Classify a prompt. Results are cached briefly so the decision shown while
 * typing is reused when the message is sent. Returns null when routing is off.
 */
export declare function routeIntent(prompt: string, signal?: AbortSignal): Promise<{
    decision: IntentDecision;
    cached: boolean;
} | null>;
export interface KeyCheckResult {
    ok: boolean;
    latencyMs?: number;
    model?: string;
    error?: string;
}
/** One tiny request (a single yes/no question) to prove the key works and measure latency. */
export declare function checkTypeSafeKey(apiKey?: string): Promise<KeyCheckResult>;
/** What the browser sees: no tool arguments, just the decision. */
export interface RouteView {
    route: IntentRoute;
    label: string;
    intent: string;
    confidence: number;
    latencyMs: number;
    model: string;
    reason: string;
    /** Jev's routing signals, so the chip can show why a route was picked. */
    signals: IntentSignals;
    /** Number of commands in an instant chain (absent for a single command). */
    steps?: number;
}
export declare function toRouteView(decision: IntentDecision): RouteView;
export {};
//# sourceMappingURL=service.d.ts.map