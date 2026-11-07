export interface UIServerOptions {
    port: number;
    host: string;
    /** Overrides the generated session token; primarily for tests. */
    token?: string;
}
export interface UIServer {
    url: string;
    /** Shared secret every `/api/*` request must present. */
    token: string;
    close(): Promise<void>;
}
export declare function startUIServer(opts: UIServerOptions): Promise<UIServer>;
//# sourceMappingURL=server.d.ts.map