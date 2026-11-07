export interface CommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
export declare function resolveCliBinary(binaryName: string, customPath?: string): Promise<string | null>;
export declare function runCommand(command: string, args: string[], opts?: {
    timeoutMs?: number;
    env?: Record<string, string>;
    cwd?: string;
}): Promise<CommandResult>;
//# sourceMappingURL=cli-utils.d.ts.map