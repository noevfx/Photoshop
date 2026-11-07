export type InstallUsageSurface = 'mcp' | 'server' | 'web';
/** Maps internal usage_surface values to install-cohort person properties. */
export declare function normalizeInstallUsageSurface(surface: string): InstallUsageSurface;
/**
 * Install-cohort fields — safe to call repeatedly.
 * See docs/anonymous-usage-analytics.md (person profile cohorts).
 */
export declare function applyInstallCohortPersonOnce(params: {
    usageSurface?: string;
    mcpClientName?: string;
}): void;
//# sourceMappingURL=install-cohorts.d.ts.map