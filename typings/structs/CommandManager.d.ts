import { PermissionResolvable } from 'discord.js';
import Client from '../client/Client.js';
import { Collection, Index } from 'js-augmentations';
import Command, { CommandOptions } from './Command.js';
import { Resolvable } from '../util/types.js';
import ParameterType, { ParameterTypeResolvable } from './ParameterType.js';
interface CommandManagerOptions {
    prefix?: string;
    allowBots?: boolean;
    permissions?: Iterable<PermissionResolvable>;
    automaticMessageParsing?: boolean;
    promptUserForInput?: boolean;
}
declare type CommandResolvable = Resolvable<Command> | Resolvable<CommandOptions>;
declare class CommandManager {
    client: Client;
    prefix: string;
    allowBots: boolean;
    groups: Collection<string>;
    index: Index<string, Command>;
    types: Index<string, ParameterType>;
    permissions: Collection<PermissionResolvable>;
    promptUserForInput: boolean;
    constructor(client: Client, options?: CommandManagerOptions);
    [Symbol.iterator](): Generator<Command, void, undefined>;
    /**
     * @param prefix A command prefix the bot should discriminate messages with
     * @example
     * setPrefix('$');
     */
    setPrefix(prefix: string): this;
    indexType(type: ParameterTypeResolvable): this;
    indexTypes(...types: Resolvable<ParameterTypeResolvable>[]): this;
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
     * const ping = new UniversalCommand()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     *
     * const purge = new GuildCommand()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     *
     * indexCommands(ping, purge);
     */
    indexCommands(...commands: CommandResolvable[]): this;
    indexDefaults(): this;
    indexGroup(name: string): this;
    indexGroups(...groups: Resolvable<string>[]): this;
    deleteCommands(...commands: CommandResolvable[] | Resolvable<string>[]): this;
    deleteGroup(group: string): this;
    deleteGroups(...groups: Resolvable<string>[]): this;
}
export { CommandManagerOptions, CommandResolvable, CommandManager };
export default CommandManager;
