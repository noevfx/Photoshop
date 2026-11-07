export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    context;
    logLevel;
    constructor(context, logLevel = LogLevel.INFO) {
        this.context = context;
        this.logLevel = process.env.LOG_LEVEL
            ? parseInt(process.env.LOG_LEVEL, 10)
            : logLevel;
    }
    log(level, message, ...args) {
        if (level < this.logLevel)
            return;
        const timestamp = new Date().toISOString();
        const levelStr = LogLevel[level];
        const prefix = `[${timestamp}] [${levelStr}] [${this.context}]`;
        // IMPORTANT: MCP uses stdout for protocol communication
        // All logs must go to stderr to avoid corrupting the JSON-RPC protocol
        // Error has no enumerable properties, so JSON.stringify printed "{}" and
        // hid every script failure ("Script execution failed: {}"). Print the
        // message. Circular or BigInt values fall back to String() instead of
        // throwing inside the logger.
        const formattedArgs = args
            .map((arg) => {
            if (arg instanceof Error)
                return arg.message;
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg) ?? String(arg);
                }
                catch {
                    return String(arg);
                }
            }
            return String(arg);
        })
            .join(' ');
        const logMessage = `${prefix} ${message} ${formattedArgs}`.trim();
        // Always write to stderr, never stdout
        process.stderr.write(logMessage + '\n');
    }
    debug(message, ...args) {
        this.log(LogLevel.DEBUG, message, ...args);
    }
    info(message, ...args) {
        this.log(LogLevel.INFO, message, ...args);
    }
    warn(message, ...args) {
        this.log(LogLevel.WARN, message, ...args);
    }
    error(message, ...args) {
        this.log(LogLevel.ERROR, message, ...args);
    }
}
//# sourceMappingURL=logger.js.map