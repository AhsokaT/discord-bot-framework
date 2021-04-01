import { Message, PermissionString } from 'discord.js';
import { Arguments } from './CommandManager.js';
import { Client } from '../client/Client.js';
export declare type CommandCallback = (message: Message, client: Client, args: Arguments) => void;
export interface Parameter {
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
     * The name of your command
     */
    name?: string;
    /**
     * The function to be executed when this command is invoked
     */
    callback?: CommandCallback;
    /**
     * A short description of your command
     */
    description?: string;
    /**
     * Whether the command should only be usable in NSFW channels; false by default
     */
    nsfw?: boolean;
    /**
     * Parameter(s) this command accepts
     */
    parameters?: Parameter[];
    /**
     * Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * The category of commands this command belongs to
     */
    category?: string;
    /**
     * Permission(s) this command requires to run
     */
    permissions?: PermissionString[];
}
export declare class Command {
    #private;
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
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    setNSFW(nsfw?: boolean): this;
    /**
     * @param category The category of commands this command belongs to
     */
    setCategory(category: string): this;
    /**
     * @param callback The function to be executed when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     */
    setCallback(callback: CommandCallback): this;
    /**
     * @param name
     * @param description
     * @param type
     * @param wordCount
     * @param required
     * @param choices
     * @example
     * addParameter('id', 'The ID of a member');
     */
    addParameter(name: string, description?: string, type?: 'string' | 'number', wordCount?: number | 'unlimited', required?: boolean, choices?: string[]): this;
    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters({ name: 'id', description: 'The ID of a member' }, { name: 'role', description: 'The ID of a role' });
     */
    addParameters(...parameters: Parameter[]): this;
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    addPermissions(...permissions: PermissionString[]): this;
    /**
     * @param alias Alternative name(s) this command can be called by
     * @example
     * addAlias('purge', 'bulkdelete');
     */
    addAlias(...alias: string[]): this;
    /**
     * Edit the properties of this command
     * @param info Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    edit(info: CommandInfo): this;
}
