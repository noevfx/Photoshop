import { Logger } from '../utils/logger.js';
export class PromptRegistry {
    logger;
    prompts;
    constructor() {
        this.logger = new Logger('PromptRegistry');
        this.prompts = new Map();
    }
    register(name, definition) {
        if (this.prompts.has(name)) {
            this.logger.warn(`Prompt '${name}' already registered, overwriting`);
        }
        this.prompts.set(name, definition);
        this.logger.debug(`Registered prompt: ${name}`);
    }
    has(name) {
        return this.prompts.has(name);
    }
    list() {
        return Array.from(this.prompts.values()).map((def) => def.prompt);
    }
    async get(name, args) {
        const def = this.prompts.get(name);
        if (!def) {
            throw new Error(`Prompt not found: ${name}`);
        }
        this.logger.debug(`Resolving prompt: ${name}`);
        return await def.handler(args);
    }
    count() {
        return this.prompts.size;
    }
}
//# sourceMappingURL=prompt-registry.js.map