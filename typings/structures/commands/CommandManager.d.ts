import { Argument, Command, CommandInfo } from './Command.js';
import { PermissionString } from 'discord.js';
import { Client } from '../client/Client.js';
export interface CommandManagerOptions {
    /**
     * - Categories your commands can belong to
     */
    categories?: string[];
    /**
     * - Whether your bot should read messages from other bots; false by default
     */
    allowBots?: boolean;
    /**
     * - The permissions to ask for when the bot is invited
     */
    permissions?: PermissionString | PermissionString[];
    /**
     * - A command prefix the bot should look for
     */
    prefix?: string;
}
export declare class CommandManager {
    #private;
    constructor(client: Client, options?: CommandManagerOptions);
    get allowBots(): boolean;
    get categories(): string[];
    get prefix(): string;
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     */
    add(command: Command | CommandInfo): Command;
    /**
     * Removes an existing command and returns it
     * @param command The name or alias of a command or an instance of the Command class
     */
    remove(command: string | Command): Command | undefined;
    /**
     * Returns a single command
     * @param command The name or alias of a command or an instance of the Command class
     */
    get(command: string | Command): Command | undefined;
    /**
     * Returns an array of all commands
     */
    all(): Command[];
}
export declare class Arguments {
    private args;
    constructor(args?: Argument[]);
    /**
     * @param name Name of your parameter
     * @returns The user input
     */
    get(name: string): string | undefined;
    /**
     * @returns The first user input
     */
    first(): string;
}
