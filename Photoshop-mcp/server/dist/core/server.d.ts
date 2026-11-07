export interface PhotoshopMCPServerOptions {
    serverVersion: string;
}
export declare class PhotoshopMCPServer {
    private server;
    private logger;
    private toolRegistry;
    private promptRegistry;
    private session;
    constructor(options: PhotoshopMCPServerOptions);
    private registerToolDefinition;
    private registerToolDefinitions;
    private registerTools;
    private setupHandlers;
    private pingPhotoshop;
    private getVersion;
    isPhotoshopConnected(): boolean;
    getToolCount(): number;
    getPhotoshopVersion(): Promise<string | undefined>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map