import { Message, Client, PermissionString } from 'discord.js';
declare type CommandCallback = (message: Message, client: Client, arguments: object) => void;
declare interface ParameterType {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    required?: boolean;
    choices?: string[];
}
export interface CommandOptions {
    /**
     * - Name of the command
     */
    name: string;
    /**
     * - The function to be executed when the command is called
     */
    callback: CommandCallback;
    /**
     * - Description of the command
     */
    description?: string;
    /**
     * - Any inputs from the user your function requires to run. Params that are not required will be automatically sorted to the back of the array
     */
    parameters?: ParameterType[];
    /**
     * - Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * - The category of commands this belongs to
     */
    category?: string;
    /**
     * - The permissions the bot and user require to run this command
     */
    permissions?: PermissionString | PermissionString[];
}
export interface EditCommand extends Omit<CommandOptions, 'name' | 'callback'> {
    name?: string;
    callback?: string;
}
export declare class Command {
    #private;
    constructor(options: CommandOptions);
    edit(options?: EditCommand): void;
    get name(): string;
    get description(): string;
    set description(description: string);
}
export {};
