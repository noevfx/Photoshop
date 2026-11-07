let cachedLaunchMethod = null;
function isNpxInvocation(npmExecPath, npmCommand) {
    if (npmCommand === 'exec' || npmCommand === 'exec-run')
        return true;
    const normalizedPath = npmExecPath.toLowerCase();
    return (normalizedPath.includes('/npx/') ||
        normalizedPath.includes('\\npx\\') ||
        /(?:^|[/\\])npx(?:\.cmd)?$/i.test(npmExecPath));
}
function isNpmScriptInvocation(npmCommand) {
    return (npmCommand === 'run-script' ||
        npmCommand === 'run' ||
        Boolean(process.env.npm_lifecycle_event?.trim()));
}
export function resolveLaunchMethod(env = process.env, argv = process.argv) {
    const npmExecPath = env.npm_execpath?.trim() ?? '';
    const npmCommand = env.npm_command?.trim() ?? '';
    if (isNpxInvocation(npmExecPath, npmCommand))
        return 'npx';
    if (isNpmScriptInvocation(npmCommand))
        return 'npm';
    const execPath = argv[0]?.trim() ?? '';
    if (/node|tsx|bun/i.test(execPath))
        return 'node';
    return 'unknown';
}
export function getLaunchMethod() {
    if (!cachedLaunchMethod) {
        cachedLaunchMethod = resolveLaunchMethod();
    }
    return cachedLaunchMethod;
}
//# sourceMappingURL=launch-method.js.map