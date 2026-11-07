import type { BetaTelemetryState } from './types.js';
export declare function getOrCreateDistinctId(): string;
export declare function isAnalyticsOptedOut(): boolean;
export declare function setAnalyticsOptOut(optedOut: boolean): void;
export declare function isAnalyticsEnabled(): boolean;
export declare function getBetaTelemetryState(): BetaTelemetryState;
export declare function isBetaTelemetryOptIn(): boolean;
export declare function setBetaTelemetryChoice(optedIn: boolean): void;
/** Returns whether a one-time funnel milestone was already captured for this install. */
export declare function hasAnalyticsMilestone(key: string): boolean;
export declare function markAnalyticsMilestone(key: string): void;
/** Accumulates usage surfaces on the anonymous person profile (mcp, server, web). */
export declare function recordUsageSurface(surface: string): string;
//# sourceMappingURL=identity.d.ts.map