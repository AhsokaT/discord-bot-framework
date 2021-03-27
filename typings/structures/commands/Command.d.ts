import { Message, Client, PermissionString } from 'discord.js';
declare type CommandCallback = (message: Message, client: Client, arguments: Argument[]) => void;
declare interface Parameter {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    required?: boolean;
    choices?: string[];
}
export interface Argument {
    name: string;
    value: string;
}
export interface CommandInfo {
    /**
     * - The name of your command
     */
    name?: string;
    /**
     * - The function to be executed when the command is called
     */
    callback?: CommandCallback;
    /**
     * - A short description of your command
     */
    description?: string;
    /**
     * Whether the command should only be usable in NSFW channels; false by default
     */
    nsfw?: boolean;
    /**
     * - Any inputs from the user your function requires to run. Params that are not required will be automatically sorted to the back of the array
     */
    parameters?: Parameter[];
    /**
     * - Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * - The category of commands your command belongs to
     */
    category?: string;
    /**
     * - The permissions the bot and user require to run this command
     */
    permissions?: PermissionString | PermissionString[];
}
export declare class Command {
    #private;
    toObject(): {
        name: string | undefined;
        description: string | undefined;
        nsfw: boolean;
        category: string | undefined;
        aliases: string[];
        parameters: Parameter[];
        permissions: PermissionString[];
        callback: CommandCallback | undefined;
    };
    constructor(info?: CommandInfo);
    get name(): string | undefined;
    get description(): string | undefined;
    get parameters(): Parameter[];
    get nsfw(): boolean;
    get category(): string | undefined;
    get permissions(): PermissionString[];
    get aliases(): string[];
    get callback(): CommandCallback | undefined;
    /**
     * @param name The name of your command
     */
    setName(name: string): this;
    /**
     * @param description A short description of your command
     */
    setDescription(description: string): this;
    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; false by default
     */
    setNSFW(nsfw: boolean): this;
    /**
     * @param category The category of commands this command belongs to
     */
    setCategory(category: string): this;
    setCallback(callback: CommandCallback): this;
    /**
     * @param parameter Parameter(s) this command accepts
     */
    addParameter(parameter: Parameter | Parameter[]): this;
    /**
     * @param permission Permission(s) this command requires to run
     */
    addPermission(permission: PermissionString | PermissionString[]): this;
    /**
     * @param alias Alternative name(s) this command can be called by
     */
    addAlias(alias: string | string[]): this;
    /**
     * Edit the properties of this command
     */
    edit(info: CommandInfo): this;
}
export {};
