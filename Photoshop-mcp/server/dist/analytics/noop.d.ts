import type { AnalyticsEvent, AnalyticsProvider } from './types.js';
export declare class NoopAnalyticsProvider implements AnalyticsProvider {
    capture(_event: AnalyticsEvent): void;
    identify(_properties?: Record<string, unknown>): void;
    setPersonOnce(_properties: Record<string, unknown>): void;
    flush(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=noop.d.ts.map