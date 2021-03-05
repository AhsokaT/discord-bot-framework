import { Command } from './Command.js';

export interface CommandManagerOptions {
    /**
     * - Categories your commands can belong to
     */
    categories?: string[];
}

export class CommandManager {
    #commands: Command[];
    #categories: string[];

    constructor(options?: CommandManagerOptions) {
        if (options?.categories) this.#categories = options.categories;
    }
}