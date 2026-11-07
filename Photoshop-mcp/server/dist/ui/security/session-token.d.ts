/**
 * Lets `npm run dev:ui` pin one token across the server and the Vite proxy so
 * a server restart does not require the proxy to re-read the session file.
 */
export declare const SESSION_TOKEN_ENV = "PSMCP_UI_TOKEN";
export declare const SESSION_TOKEN_HEADER = "x-psmcp-token";
export interface SessionFile {
    token: string;
    port: number;
    pid: number;
    createdAt: number;
}
export declare function getSessionFilePath(): string;
export declare function createSessionToken(): string;
export declare function writeSessionFile(session: Omit<SessionFile, 'createdAt'>): void;
export declare function readSessionFile(): SessionFile | null;
export declare function removeSessionFile(): void;
export declare function matchesSessionToken(candidate: string | undefined, token: string): boolean;
/** Accepts the dedicated header or an `Authorization: Bearer <token>` header. */
export declare function extractRequestToken(headers: {
    token: string | undefined;
    authorization: string | undefined;
}): string | undefined;
//# sourceMappingURL=session-token.d.ts.map