import type { AnalyticsEvent, AnalyticsProvider } from './types.js';
export declare class RybbitNodeProvider implements AnalyticsProvider {
    private logger;
    private distinctId;
    private analyticsHost;
    private siteId;
    private apiKey;
    private queue;
    private flushTimer;
    private identified;
    private draining;
    constructor();
    identify(properties?: Record<string, unknown>): void;
    setPersonOnce(properties: Record<string, unknown>): void;
    capture(event: AnalyticsEvent): void;
    flush(): Promise<void>;
    shutdown(): Promise<void>;
    private enqueue;
    private send;
}
//# sourceMappingURL=rybbit-node.d.ts.map