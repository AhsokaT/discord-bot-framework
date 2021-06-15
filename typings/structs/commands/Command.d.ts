import { Message } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import DMCommand from './DMCommand.js';
import GuildCommand from './GuildCommand.js';
declare type CommandCallback = (this: Command, message: Message, client: Client, args: Index<string, string>) => void;
declare type ParameterType = 'string' | 'number' | 'boolean' | 'user' | 'member' | 'channel' | 'role' | 'mentionable';
interface CommandParameter {
    name: string;
    description?: string;
    type?: ParameterType | ParameterType[];
    wordCount?: number | 'unlimited';
    caseSensitive?: boolean;
    required?: boolean;
    choices?: string[];
}
interface CommandProperties {
    name: string;
    nsfw: boolean;
    group: string;
    description: string;
    parameters: Iterable<CommandParameter>;
    aliases: Iterable<string>;
    callback: CommandCallback;
    type: 'DM' | 'Guild' | 'Universal';
}
interface CommandOptions extends Partial<Omit<CommandProperties, 'type'>> {
}
declare class Command implements CommandProperties {
    name: string;
    description: string;
    group: string;
    nsfw: boolean;
    aliases: Collection<string>;
    parameters: Collection<CommandParameter>;
    callback: CommandCallback;
    type: 'DM' | 'Guild' | 'Universal';
    constructor(properties?: CommandOptions);
    isGuildCommand(): this is GuildCommand;
    isDMCommand(): this is DMCommand;
    isUniversalCommand(): this is Command;
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
    addParameters(...parameters: CommandParameter[] | CommandParameter[][]): this;
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
export { CommandProperties, CommandParameter, CommandCallback };
export default Command;
