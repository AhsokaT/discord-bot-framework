import { Command, CommandOptions } from './Command.js';
export interface CommandManagerOptions {
    /**
     * - Categories your commands can belong to
     */
    categories?: string[];
}
export declare class CommandManager {
    #private;
    constructor(options?: CommandManagerOptions);
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     */
    add(command: Command | CommandOptions): Command;
    /**
     * Removes an existing command and returns it
     */
    remove(command: string | Command): Command | undefined;
    /**
     * Returns a single command
     */
    get(command: string | Command): Command | undefined;
    /**
     * Returns an array of all commands
     */
    all(): Command[];
    get categories(): string[];
}
