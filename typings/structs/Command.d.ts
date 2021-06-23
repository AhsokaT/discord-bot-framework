import { Message, PermissionResolvable } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../client/Client.js';
import Argument from './Argument.js';
import { Parameter, ParameterResolvable } from './Parameter.js';
import { ParameterTypeResolvable } from './ParameterType.js';
declare type CommandCallback = (this: Command, message: Message, args: Index<string, Argument>, client: Client) => void;
declare type CommandType = 'DM' | 'Guild' | 'Universal';
interface CommandOptions {
    name?: string;
    nsfw?: boolean;
    group?: string;
    description?: string;
    callback?: CommandCallback;
    parameters?: Iterable<Parameter>;
    aliases?: Iterable<string>;
    permissions?: Iterable<PermissionResolvable>;
    type?: CommandType;
}
declare class UserInput {
    value: any;
    type: ParameterTypeResolvable;
    constructor(value: any, type: ParameterTypeResolvable);
    toString(): string;
}
declare class Command implements Required<CommandOptions> {
    name: string;
    description: string;
    group: string;
    nsfw: boolean;
    aliases: Collection<string>;
    parameters: Collection<Parameter>;
    callback: CommandCallback;
    permissions: Collection<PermissionResolvable>;
    type: CommandType;
    constructor(properties?: CommandOptions);
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
     * The type property of a command determines where the command can be called,
     * either in a DM channel, Guild channel or both
     * @param type
     */
    setType(type: CommandType): this;
    /**
     * @param callback The function to be called when this command is invoked
     * @example
     * setCallback((message, args, client) => message.reply('pong!'));
     *
     * setCallback(function(message, args, client) {
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
    addParameters(...parameters: ParameterResolvable[]): this;
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions: PermissionResolvable[]): this;
    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    addAliases(...aliases: string[]): this;
    /**
     * Edit the properties of this command
     * @param properties Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Delete messages' });
     */
    edit(properties: CommandOptions): this;
}
export { Command, CommandOptions, CommandCallback, CommandType, UserInput };
export default Command;
