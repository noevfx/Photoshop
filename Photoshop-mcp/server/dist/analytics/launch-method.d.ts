export type LaunchMethod = 'npx' | 'npm' | 'node' | 'unknown';
export declare function resolveLaunchMethod(env?: NodeJS.ProcessEnv, argv?: string[]): LaunchMethod;
export declare function getLaunchMethod(): LaunchMethod;
//# sourceMappingURL=launch-method.d.ts.map