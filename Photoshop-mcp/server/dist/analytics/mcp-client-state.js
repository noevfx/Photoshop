let activeClientName;
let activeClientVersion;
export function setActiveMcpClient(client) {
    activeClientName = client?.name ?? 'unknown';
    activeClientVersion = client?.version ?? 'unknown';
}
export function clearActiveMcpClient() {
    activeClientName = undefined;
    activeClientVersion = undefined;
}
export function getActiveMcpClient() {
    return {
        ...(activeClientName ? { name: activeClientName } : {}),
        ...(activeClientVersion ? { version: activeClientVersion } : {}),
    };
}
export function hasActiveMcpClient() {
    return activeClientName !== undefined;
}
//# sourceMappingURL=mcp-client-state.js.map