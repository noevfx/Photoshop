export type AnalyticsMilestone = 'mcp_first_tool_success' | 'mcp_photoshop_first_connected';
/**
 * Fires a one-time funnel milestone per install. Uses a persisted local flag
 * so a process restart does not send the same milestone twice.
 */
export declare function captureAnalyticsMilestoneOnce(milestone: AnalyticsMilestone, properties?: Record<string, unknown>): boolean;
//# sourceMappingURL=milestones.d.ts.map