export declare function sanitizeAnalyticsProperties(properties: Record<string, unknown> | undefined): Record<string, string | number | boolean | string[]>;
/** Sanitize person.set_once cohort properties (not attached to every event). */
export declare function sanitizePersonOnceProperties(properties: Record<string, unknown> | undefined): Record<string, string | number | boolean>;
export declare function buildRuntimeProperties(properties: Record<string, unknown> | undefined): Record<string, string | number | boolean | string[]>;
/** Person-profile fields merged on identify() — includes install-level hardware signals. */
export declare function buildPersonIdentifyProperties(properties?: Record<string, unknown>): Record<string, string | number | boolean>;
//# sourceMappingURL=events.d.ts.map