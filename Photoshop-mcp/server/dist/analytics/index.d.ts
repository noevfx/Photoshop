import { captureBetaChatTurn } from './beta-telemetry.js';
import { getAppVersion } from './app-version.js';
import { getBetaTelemetryState, setBetaTelemetryChoice } from './identity.js';
import { onMcpClientConnected, onMcpClientDisconnected } from './mcp-client.js';
import { captureMcpPageleave, captureMcpPageview, endMcpAnalyticsSession, recordMcpPromptRequest, recordMcpToolCall, startLogicalMcpAnalyticsSession, startMcpAnalyticsSession } from './mcp-session.js';
import { getAnalytics, resetAnalyticsProvider } from './provider.js';
import type { AnalyticsEvent, AnalyticsProvider, AnalyticsRuntimeConfig, BetaTelemetryState, UsageSurface } from './types.js';
export type { McpShutdownReason } from './mcp-session.js';
/** Persist the install ID and register one anonymous analytics person per process. */
export declare function ensureAnalyticsIdentity(): void;
export declare function capture(name: string, properties?: Record<string, unknown>, options?: {
    insertId?: string;
}): void;
export declare function identifyAnalyticsPerson(properties?: Record<string, unknown>): void;
/** Refresh the anonymous person profile when Photoshop version becomes known. */
export declare function identifyPhotoshopVersion(version: string): void;
/** Record standalone UI provider/model choice on the person profile (no prompt content). */
export declare function identifyUiModelSelection(providerId: string, model: string): void;
export declare function shutdownAnalytics(): Promise<void>;
export declare function getAnalyticsRuntimeConfig(): AnalyticsRuntimeConfig;
export { captureAnalyticsMilestoneOnce } from './milestones.js';
export type { AnalyticsMilestone } from './milestones.js';
export { captureBetaChatTurn, captureMcpPageleave, captureMcpPageview, endMcpAnalyticsSession, getAnalytics, getAppVersion, getBetaTelemetryState, onMcpClientConnected, onMcpClientDisconnected, recordMcpPromptRequest, recordMcpToolCall, resetAnalyticsProvider, setBetaTelemetryChoice, startLogicalMcpAnalyticsSession, startMcpAnalyticsSession, };
export type { AnalyticsEvent, AnalyticsProvider, AnalyticsRuntimeConfig, BetaTelemetryState, UsageSurface, };
//# sourceMappingURL=index.d.ts.map