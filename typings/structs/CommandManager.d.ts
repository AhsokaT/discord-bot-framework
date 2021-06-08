import { PermissionString } from 'discord.js';
import Client from '../client/Client.js';
import { Collection, Index } from 'js-augmentations';
import GuildCommand, { GuildCommandProperties } from './commands/GuildCommand.js';
import DMCommand, { DMCommandProperties } from './commands/DMCommand.js';
import Command from './commands/BaseCommand.js';
interface CommandManagerOptions {
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionString[];
    automaticMessageParsing?: boolean;
}
declare type Resolvable<T> = T | Iterable<T>;
declare type CommandResolvable = Resolvable<GuildCommand> | Resolvable<GuildCommandProperties> | Resolvable<DMCommand> | Resolvable<DMCommandProperties>;
export default class CommandManager {
    client: Client;
    prefix: string;
    allowBots: boolean;
    groups: Collection<string>;
    index: Index<string, GuildCommand | DMCommand | Command>;
    permissions: Collection<PermissionString>;
    constructor(client: Client, options?: CommandManagerOptions);
    /**
     * @param prefix A command prefix the bot should discriminate messages with
     * @example
     * setPrefix('$');
     */
    setPrefix(prefix: string): this;
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     * @example
     * const command = new Command()
     *      .setName('name')
     *      .setDescription('description')
     *
     * indexCommand(command);
     */
    indexCommand(command: CommandResolvable): this;
    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     * @example
     * const ping = new Command()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     *
     * const purge = new Command()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     *
     * indexCommands(ping, purge);
     */
    indexCommands(...commands: CommandResolvable[]): this;
    indexDefaults(): this;
    indexGroup(name: string): this;
    indexGroups(...groups: string[] | string[][]): this;
    deleteCommands(...commands: CommandResolvable[] | string[]): this;
    deleteGroup(group: string): this;
    deleteGroups(...groups: string[] | string[][]): this;
}
export { CommandManagerOptions, CommandResolvable, CommandManager };
