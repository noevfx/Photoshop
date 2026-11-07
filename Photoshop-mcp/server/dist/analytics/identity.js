import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPhotoshopMcpHomeDir } from '../lib/export-paths.js';
import { kvGet, kvSet } from '../ui/store/kv.js';
import { isAnalyticsDisabledByEnv } from './config.js';
const DISTINCT_ID_KEY = 'analytics_distinct_id';
const OPT_OUT_KEY = 'analytics_opt_out';
const BETA_TELEMETRY_OPT_IN_KEY = 'beta_telemetry_opt_in';
const BETA_TELEMETRY_PROMPT_ANSWERED_KEY = 'beta_telemetry_prompt_answered';
const USAGE_SURFACES_KEY = 'analytics_usage_surfaces';
const MILESTONES_KEY = 'analytics_milestones';
const STORE_FILE = 'analytics-store.json';
let memoryDistinctId = null;
let dbAvailable = null;
function getStorePath() {
    return join(getPhotoshopMcpHomeDir(), STORE_FILE);
}
function readFileStore() {
    try {
        const raw = readFileSync(getStorePath(), 'utf8');
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
function writeFileStore(store) {
    const dir = getPhotoshopMcpHomeDir();
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    writeFileSync(getStorePath(), JSON.stringify(store), { mode: 0o600 });
}
function canUseKv() {
    if (dbAvailable === false)
        return false;
    try {
        kvGet('__analytics_probe__');
        dbAvailable = true;
        return true;
    }
    catch {
        dbAvailable = false;
        return false;
    }
}
function readDistinctIdFromKv() {
    if (!canUseKv())
        return undefined;
    try {
        return kvGet(DISTINCT_ID_KEY);
    }
    catch {
        dbAvailable = false;
        return undefined;
    }
}
function writeDistinctIdToKv(id) {
    if (!canUseKv())
        return;
    try {
        kvSet(DISTINCT_ID_KEY, id);
    }
    catch {
        dbAvailable = false;
    }
}
function readOptOutFromKv() {
    if (!canUseKv())
        return undefined;
    try {
        return kvGet(OPT_OUT_KEY);
    }
    catch {
        dbAvailable = false;
        return undefined;
    }
}
function writeOptOutToKv(optedOut) {
    if (!canUseKv())
        return;
    try {
        kvSet(OPT_OUT_KEY, optedOut);
    }
    catch {
        dbAvailable = false;
    }
}
export function getOrCreateDistinctId() {
    if (memoryDistinctId)
        return memoryDistinctId;
    const fromKv = readDistinctIdFromKv();
    if (fromKv) {
        memoryDistinctId = fromKv;
        return fromKv;
    }
    const fromFile = readFileStore().distinctId;
    if (fromFile) {
        memoryDistinctId = fromFile;
        writeDistinctIdToKv(fromFile);
        return fromFile;
    }
    const id = randomUUID();
    memoryDistinctId = id;
    writeDistinctIdToKv(id);
    const store = readFileStore();
    writeFileStore({ ...store, distinctId: id });
    return id;
}
export function isAnalyticsOptedOut() {
    if (isAnalyticsDisabledByEnv())
        return true;
    const fromKv = readOptOutFromKv();
    if (fromKv !== undefined)
        return fromKv;
    return readFileStore().optedOut === true;
}
export function setAnalyticsOptOut(optedOut) {
    writeOptOutToKv(optedOut);
    const store = readFileStore();
    writeFileStore({ ...store, optedOut });
}
export function isAnalyticsEnabled() {
    return !isAnalyticsOptedOut();
}
function readBooleanFromKv(key) {
    if (!canUseKv())
        return undefined;
    try {
        return kvGet(key);
    }
    catch {
        dbAvailable = false;
        return undefined;
    }
}
function writeBooleanToKv(key, value) {
    if (!canUseKv())
        return;
    try {
        kvSet(key, value);
    }
    catch {
        dbAvailable = false;
    }
}
export function getBetaTelemetryState() {
    const fromKvOptIn = readBooleanFromKv(BETA_TELEMETRY_OPT_IN_KEY);
    const fromKvAnswered = readBooleanFromKv(BETA_TELEMETRY_PROMPT_ANSWERED_KEY);
    const fileStore = readFileStore();
    return {
        betaTelemetryOptIn: fromKvOptIn ?? fileStore.betaTelemetryOptIn ?? false,
        betaTelemetryPromptAnswered: fromKvAnswered ?? fileStore.betaTelemetryPromptAnswered ?? false,
    };
}
export function isBetaTelemetryOptIn() {
    return getBetaTelemetryState().betaTelemetryOptIn;
}
export function setBetaTelemetryChoice(optedIn) {
    writeBooleanToKv(BETA_TELEMETRY_OPT_IN_KEY, optedIn);
    writeBooleanToKv(BETA_TELEMETRY_PROMPT_ANSWERED_KEY, true);
    const store = readFileStore();
    writeFileStore({
        ...store,
        betaTelemetryOptIn: optedIn,
        betaTelemetryPromptAnswered: true,
    });
}
function readUsageSurfacesFromStore() {
    if (canUseKv()) {
        try {
            const fromKv = kvGet(USAGE_SURFACES_KEY);
            if (Array.isArray(fromKv))
                return fromKv.filter((s) => typeof s === 'string' && s.trim());
        }
        catch {
            dbAvailable = false;
        }
    }
    const fromFile = readFileStore().usageSurfaces;
    return Array.isArray(fromFile)
        ? fromFile.filter((s) => typeof s === 'string' && s.trim())
        : [];
}
function writeUsageSurfacesToStore(surfaces) {
    if (canUseKv()) {
        try {
            kvSet(USAGE_SURFACES_KEY, surfaces);
        }
        catch {
            dbAvailable = false;
        }
    }
    const store = readFileStore();
    writeFileStore({ ...store, usageSurfaces: surfaces });
}
function readMilestonesFromStore() {
    if (canUseKv()) {
        try {
            const fromKv = kvGet(MILESTONES_KEY);
            if (fromKv && typeof fromKv === 'object')
                return fromKv;
        }
        catch {
            dbAvailable = false;
        }
    }
    return readFileStore().milestones ?? {};
}
function writeMilestonesToStore(milestones) {
    if (canUseKv()) {
        try {
            kvSet(MILESTONES_KEY, milestones);
        }
        catch {
            dbAvailable = false;
        }
    }
    const store = readFileStore();
    writeFileStore({ ...store, milestones });
}
/** Returns whether a one-time funnel milestone was already captured for this install. */
export function hasAnalyticsMilestone(key) {
    return readMilestonesFromStore()[key] === true;
}
export function markAnalyticsMilestone(key) {
    const milestones = { ...readMilestonesFromStore(), [key]: true };
    writeMilestonesToStore(milestones);
}
/** Accumulates usage surfaces on the anonymous person profile (mcp, server, web). */
export function recordUsageSurface(surface) {
    const normalized = surface.trim();
    if (!normalized) {
        return readUsageSurfacesFromStore().sort().join(',');
    }
    const merged = [...new Set([...readUsageSurfacesFromStore(), normalized])].sort();
    writeUsageSurfacesToStore(merged);
    return merged.join(',');
}
//# sourceMappingURL=identity.js.map