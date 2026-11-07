export declare const UPDATE_CHECK_ENV = "PSMCP_UPDATE_CHECK";
export declare const INSTALL_CHANNEL_ENV = "PSMCP_INSTALL_CHANNEL";
export declare const UPDATE_NOTICE_MARKER = "UPDATE_AVAILABLE";
export declare const NPM_PACKAGE_NAME = "@alisaitteke/photoshop-mcp";
/** dist-tags only: ~20 bytes instead of the full packument. */
export declare const UPDATE_CHECK_URL = "https://registry.npmjs.org/-/package/@alisaitteke%2fphotoshop-mcp/dist-tags";
export declare const UPDATE_CHECK_INTERVAL_MS: number;
export declare const UPDATE_CHECK_TIMEOUT_MS = 3000;
export declare const UPDATE_NOTICE_COOLDOWN_MS: number;
export type InstallChannel = 'npx' | 'mcpb' | 'npm' | 'source';
export interface UpdateCheckStore {
    /** Last successful registry lookup. Failed lookups are not stamped, so the next start retries. */
    checkedAt?: number;
    latestVersion?: string;
    notifiedAt?: number;
    notifiedVersion?: string;
}
export interface UpdateNotice {
    currentVersion: string;
    latestVersion: string;
    channel: InstallChannel;
}
type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
/**
 * On by default. Off with `PSMCP_UPDATE_CHECK=0`, any `NO_UPDATE_NOTIFIER`, a truthy `CI`,
 * and when the standalone UI spawns this server (its agent is not the user's host).
 */
export declare function isUpdateCheckEnabled(env?: NodeJS.ProcessEnv): boolean;
interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    prerelease: string | null;
}
export declare function parseVersion(raw: string): ParsedVersion | null;
/** True when `latest` is a stable release newer than `current`. Unknown versions never notify. */
export declare function isNewerStableVersion(latest: string, current: string): boolean;
/** How this copy was installed, so the notice can give one correct update step. */
export declare function detectInstallChannel(env?: NodeJS.ProcessEnv, modulePath?: string): InstallChannel;
export declare function buildUpdateInstruction(channel: InstallChannel, currentVersion: string): string;
/** Latest dist-tag from npm, or undefined on any failure (offline, timeout, bad payload). */
export declare function fetchLatestVersion(fetchImpl?: FetchLike, timeoutMs?: number): Promise<string | undefined>;
export interface RefreshUpdateCheckOptions {
    now?: number;
    fetchImpl?: FetchLike;
    timeoutMs?: number;
}
/**
 * Look up the latest npm release at most once per 24 hours and cache it under
 * ~/.photoshop-mcp/update-check.json. Never throws; concurrent calls share one request.
 * Tool calls only read the cache, so a slow or missing network never delays them.
 */
export declare function refreshUpdateCheck(options?: RefreshUpdateCheckOptions): Promise<void>;
/** A notice when the cached release is newer and none was shown in the last 7 days. */
export declare function getDueUpdateNotice(now?: number, currentVersion?: string): UpdateNotice | null;
export declare function markUpdateNoticeShown(latestVersion: string, now?: number): void;
export declare function buildUpdateNoticeBlock(notice: UpdateNotice): string;
/**
 * The UPDATE_AVAILABLE block for this ping, or null. Starts the 7-day cooldown when it
 * returns a block; if the cooldown cannot be saved, shows nothing rather than repeat it every ping.
 */
export declare function takeUpdateNoticeBlock(now?: number): string | null;
export {};
//# sourceMappingURL=check.d.ts.map