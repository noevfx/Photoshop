import { hasAnalyticsKey } from './config.js';
import { buildRuntimeProperties } from './events.js';
import { isAnalyticsEnabled } from './identity.js';
import { beginLogicalSession, noteLogicalSessionActivity } from './logical-session.js';
import { getActiveMcpClient } from './mcp-client-state.js';
import { captureAnalyticsMilestoneOnce } from './milestones.js';
import { flushAnalyticsClient, getAnalytics } from './provider.js';
const MCP_VIRTUAL_URL = 'photoshop-mcp://mcp';
/** Flush after the last tool in a burst — fits IDE agent turns (LLM pauses between bursts). */
const DEBOUNCE_FLUSH_MS = 3_000;
/** Force flush during long uninterrupted tool chains (no debounce gap). */
const MAX_BATCH_HOLD_MS = 60_000;
const MAX_SUMMARY_LENGTH = 800;
let toolBatch = new Map();
let debounceFlushTimer = null;
let maxHoldFlushTimer = null;
let promptBatch = new Map();
let promptCatalogSize = 0;
let promptDebounceFlushTimer = null;
let promptMaxHoldFlushTimer = null;
/** Pure burst math for mcp_prompt_batch. catalogSize is the registry count at record time. */
export function summarizePromptBatch(counts, catalogSize) {
    let promptsRequestedCount = 0;
    for (const count of counts.values()) {
        promptsRequestedCount += count;
    }
    const uniquePromptsCount = counts.size;
    const promptsUsed = [...counts.keys()].sort();
    const parts = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name, count]) => `${name}:${count}`);
    let promptUsageSummary = parts.join(',');
    if (promptUsageSummary.length > MAX_SUMMARY_LENGTH) {
        promptUsageSummary = `${promptUsageSummary.slice(0, MAX_SUMMARY_LENGTH)}…`;
    }
    return {
        prompts_requested_count: promptsRequestedCount,
        unique_prompts_count: uniquePromptsCount,
        prompt_usage_summary: promptUsageSummary,
        prompts_used: promptsUsed,
        full_catalog: catalogSize > 0 && uniquePromptsCount === catalogSize,
        catalog_size: catalogSize,
        repeat: uniquePromptsCount > 0 ? promptsRequestedCount / uniquePromptsCount : 0,
    };
}
function captureMcpEvent(name, properties) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    const client = getActiveMcpClient();
    getAnalytics().capture({
        name,
        properties: buildRuntimeProperties({
            ...(client.name ? { mcp_client_name: client.name } : {}),
            ...(client.version ? { mcp_client_version: client.version } : {}),
            ...properties,
        }),
    });
}
function capturePageEvent(name, properties) {
    if (!isAnalyticsEnabled() || !hasAnalyticsKey())
        return;
    getAnalytics().capture({
        name,
        properties: buildRuntimeProperties(properties),
    });
}
/** Virtual /mcp hit so MCP-only installs show up next to UI traffic. */
export function captureMcpPageview() {
    capturePageEvent('$pageview', {
        $current_url: MCP_VIRTUAL_URL,
        $pathname: '/mcp',
        usage_surface: 'mcp',
        event_source: 'mcp',
    });
}
export function captureMcpPageleave(durationMs, reason) {
    capturePageEvent('$pageleave', {
        $current_url: MCP_VIRTUAL_URL,
        duration_ms: durationMs,
        shutdown_reason: reason,
        usage_surface: 'mcp',
        event_source: 'mcp',
    });
}
function clearDebounceFlushTimer() {
    if (!debounceFlushTimer)
        return;
    clearTimeout(debounceFlushTimer);
    debounceFlushTimer = null;
}
function clearMaxHoldFlushTimer() {
    if (!maxHoldFlushTimer)
        return;
    clearTimeout(maxHoldFlushTimer);
    maxHoldFlushTimer = null;
}
function clearFlushTimers() {
    clearDebounceFlushTimer();
    clearMaxHoldFlushTimer();
}
function formatUsageSummary(batch) {
    const parts = [...batch.entries()]
        .sort((a, b) => b[1].ok + b[1].fail - (a[1].ok + a[1].fail))
        .map(([name, entry]) => `${name}:${entry.ok + entry.fail}`);
    let summary = parts.join(',');
    if (summary.length > MAX_SUMMARY_LENGTH) {
        summary = `${summary.slice(0, MAX_SUMMARY_LENGTH)}…`;
    }
    return summary;
}
function formatErrorCodesSummary(batch) {
    const totals = new Map();
    for (const entry of batch.values()) {
        for (const [code, count] of entry.errors) {
            totals.set(code, (totals.get(code) ?? 0) + count);
        }
    }
    if (totals.size === 0)
        return undefined;
    return [...totals.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([code, count]) => `${code}:${count}`)
        .join(',');
}
function collectErrorCodes(batch) {
    const codes = new Set();
    for (const entry of batch.values()) {
        for (const code of entry.errors.keys()) {
            codes.add(code);
        }
    }
    return [...codes].sort();
}
export function flushMcpToolBatch(reason) {
    if (toolBatch.size === 0)
        return;
    let toolsCalledCount = 0;
    let toolsErrorCount = 0;
    let totalDurationMs = 0;
    for (const entry of toolBatch.values()) {
        toolsCalledCount += entry.ok + entry.fail;
        toolsErrorCount += entry.fail;
        totalDurationMs += entry.durationMs;
    }
    const errorCodesSummary = formatErrorCodesSummary(toolBatch);
    const errorCodes = collectErrorCodes(toolBatch);
    const toolsUsed = [...toolBatch.keys()].sort();
    captureMcpEvent('mcp_tool_batch', {
        tools_called_count: toolsCalledCount,
        tools_error_count: toolsErrorCount,
        unique_tools_count: toolBatch.size,
        tool_usage_summary: formatUsageSummary(toolBatch),
        tools_used: toolsUsed,
        had_errors: toolsErrorCount > 0,
        ...(errorCodesSummary ? { error_codes_summary: errorCodesSummary } : {}),
        ...(errorCodes.length > 0 ? { error_codes: errorCodes } : {}),
        batch_flush_reason: reason,
        duration_ms: totalDurationMs,
        event_source: 'mcp',
    });
    // Deliver the batch immediately — long-lived MCP stdio sessions may never call shutdown().
    void flushAnalyticsClient().catch(() => { });
    toolBatch.clear();
    clearFlushTimers();
}
function clearPromptDebounceFlushTimer() {
    if (!promptDebounceFlushTimer)
        return;
    clearTimeout(promptDebounceFlushTimer);
    promptDebounceFlushTimer = null;
}
function clearPromptMaxHoldFlushTimer() {
    if (!promptMaxHoldFlushTimer)
        return;
    clearTimeout(promptMaxHoldFlushTimer);
    promptMaxHoldFlushTimer = null;
}
function clearPromptFlushTimers() {
    clearPromptDebounceFlushTimer();
    clearPromptMaxHoldFlushTimer();
}
export function flushMcpPromptBatch(reason) {
    if (promptBatch.size === 0)
        return;
    const summary = summarizePromptBatch(promptBatch, promptCatalogSize);
    captureMcpEvent('mcp_prompt_batch', {
        ...summary,
        batch_flush_reason: reason,
        event_source: 'mcp',
    });
    void flushAnalyticsClient().catch(() => { });
    promptBatch = new Map();
    promptCatalogSize = 0;
    clearPromptFlushTimers();
}
function schedulePromptBatchFlush() {
    clearPromptDebounceFlushTimer();
    promptDebounceFlushTimer = setTimeout(() => {
        promptDebounceFlushTimer = null;
        flushMcpPromptBatch('debounce');
    }, DEBOUNCE_FLUSH_MS);
    promptDebounceFlushTimer.unref?.();
    if (!promptMaxHoldFlushTimer) {
        promptMaxHoldFlushTimer = setTimeout(() => {
            promptMaxHoldFlushTimer = null;
            flushMcpPromptBatch('max_hold');
        }, MAX_BATCH_HOLD_MS);
        promptMaxHoldFlushTimer.unref?.();
    }
}
export function recordMcpPromptRequest(name, catalogSize) {
    promptCatalogSize = catalogSize;
    promptBatch.set(name, (promptBatch.get(name) ?? 0) + 1);
    noteLogicalSessionActivity();
    captureMcpEvent('mcp_prompt_requested', {
        prompt_name: name,
        event_source: 'mcp',
    });
    schedulePromptBatchFlush();
}
export function flushMcpPromptBatchOnClientDisconnect() {
    flushMcpPromptBatch('client_disconnect');
}
function scheduleBatchFlush() {
    clearDebounceFlushTimer();
    debounceFlushTimer = setTimeout(() => {
        debounceFlushTimer = null;
        flushMcpToolBatch('debounce');
    }, DEBOUNCE_FLUSH_MS);
    debounceFlushTimer.unref?.();
    if (!maxHoldFlushTimer) {
        maxHoldFlushTimer = setTimeout(() => {
            maxHoldFlushTimer = null;
            flushMcpToolBatch('max_hold');
        }, MAX_BATCH_HOLD_MS);
        maxHoldFlushTimer.unref?.();
    }
}
export function startMcpAnalyticsSession() {
    beginLogicalSession();
}
/** Process start: emit session/pageview only when the 30m logical window is new. */
export function startLogicalMcpAnalyticsSession(properties) {
    const result = beginLogicalSession();
    if (result.closedPrevious) {
        captureMcpPageleave(result.closedPrevious.durationMs, result.closedPrevious.shutdownReason);
        captureMcpEvent('mcp_session_ended', {
            duration_ms: result.closedPrevious.durationMs,
            shutdown_reason: result.closedPrevious.shutdownReason,
            event_source: 'mcp',
        });
    }
    if (!result.isNew)
        return;
    captureMcpPageview();
    captureMcpEvent('mcp_session_started', {
        photoshop_detected: properties.photoshop_detected,
        tools_registered_count: properties.tools_registered_count,
        event_source: 'mcp',
    });
}
export function recordMcpToolCall(params) {
    const existing = toolBatch.get(params.toolName) ?? {
        ok: 0,
        fail: 0,
        errors: new Map(),
        durationMs: 0,
    };
    if (params.ok) {
        existing.ok += 1;
    }
    else {
        existing.fail += 1;
        if (params.errorCode) {
            existing.errors.set(params.errorCode, (existing.errors.get(params.errorCode) ?? 0) + 1);
        }
    }
    existing.durationMs += params.durationMs;
    toolBatch.set(params.toolName, existing);
    noteLogicalSessionActivity();
    if (params.ok) {
        captureAnalyticsMilestoneOnce('mcp_first_tool_success', {
            tool_name: params.toolName,
            event_source: 'mcp',
        });
    }
    scheduleBatchFlush();
}
export function flushMcpToolBatchOnClientDisconnect() {
    flushMcpToolBatch('client_disconnect');
}
export function endMcpAnalyticsSession(_reason) {
    flushMcpToolBatch('shutdown');
    flushMcpPromptBatch('shutdown');
    noteLogicalSessionActivity();
    toolBatch.clear();
    clearFlushTimers();
    promptBatch = new Map();
    promptCatalogSize = 0;
    clearPromptFlushTimers();
}
//# sourceMappingURL=mcp-session.js.map