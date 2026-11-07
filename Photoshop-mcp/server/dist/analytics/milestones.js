import { hasAnalyticsKey } from './config.js';
import { buildRuntimeProperties } from './events.js';
import { getOrCreateDistinctId, hasAnalyticsMilestone, isAnalyticsEnabled, markAnalyticsMilestone, } from './identity.js';
import { getAnalytics } from './provider.js';
/**
 * Fires a one-time funnel milestone per install. Uses a persisted local flag
 * so a process restart does not send the same milestone twice.
 */
export function captureAnalyticsMilestoneOnce(milestone, properties = {}) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return false;
    if (hasAnalyticsMilestone(milestone))
        return false;
    markAnalyticsMilestone(milestone);
    const distinctId = getOrCreateDistinctId();
    getAnalytics().capture({
        name: milestone,
        properties: buildRuntimeProperties(properties),
        insertId: `${distinctId}:${milestone}`,
    });
    return true;
}
//# sourceMappingURL=milestones.js.map