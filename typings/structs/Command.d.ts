import { Message, PermissionString } from 'discord.js';
import Client from '../client/Client.js';
import { Collection, Index } from 'js-augmentations';
export declare type CommandCallback = (this: Command, message: Message, client: Client, args: Index<string, string>) => void;
export interface Parameter {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    caseSensitive?: boolean;
    required?: boolean;
    choices?: string[];
}
export interface CommandDetails {
    name?: string;
    description?: string;
    group?: string;
    nsfw?: boolean;
    aliases?: string[];
    permissions?: PermissionString[];
    parameters?: Parameter[];
    callback?: CommandCallback;
}
export default class Command {
    #private;
    /**
     * @param {CommandDetails} details
     */
    constructor(details?: CommandDetails);
    get name(): string;
    get description(): string;
    get aliases(): Collection<string>;
    get permissions(): Collection<PermissionString>;
    get callback(): CommandCallback;
    get group(): string;
    get parameters(): Collection<Parameter>;
    get nsfw(): boolean;
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
     * @param group The group of commands this command belongs to
     */
    setGroup(group: string): this;
    /**
     * @param callback The function to be called when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     *
     * setCallback(function(message, client, args) {
     *      message.channel.send(this.name, this.description);
     * });
     */
    setCallback(callback: CommandCallback): this;
    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters(
     *    { name: 'id', description: 'The ID of a member', wordCount: 1 },
     *    { name: 'role', description: 'The ID of a role', required: false }
     * );
     */
    addParameters(...parameters: Parameter[] | Parameter[][]): this;
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    addPermissions(...permissions: PermissionString[]): this;
    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    addAliases(...aliases: string[]): this;
    /**
     * Edit the properties of this command
     * @param details Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    edit(details: CommandDetails): this;
}
