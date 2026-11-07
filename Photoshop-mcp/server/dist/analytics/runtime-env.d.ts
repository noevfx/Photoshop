/** Rounded total installed RAM in GB — attached to the anonymous person profile only. */
export declare function getTotalRamGb(): number;
/** Bucketed memory tier (GB) for person-profile cohort segmentation. */
export declare function getMemoryGbBucket(): number;
/** CPU model only — no hostname, username, or serial. */
export declare function getMachineModel(): string | undefined;
/** Whole hours the OS has been up, or undefined when the OS refuses the read. */
export declare function getUptimeHours(): number | undefined;
/** Remember a detected Photoshop version so later session events can carry it. */
export declare function rememberPhotoshopVersion(version: string): void;
export declare function getKnownPhotoshopVersion(): string | undefined;
/** Anonymous machine/runtime signals safe to attach to every server-side event. */
export declare function buildAnonymousRuntimeEnv(): Record<string, string | number | boolean>;
//# sourceMappingURL=runtime-env.d.ts.map