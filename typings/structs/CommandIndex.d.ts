import { PermissionString } from 'discord.js';
import Client from '../client/Client.js';
import Command, { CommandDetails } from './Command.js';
import { Collection, Index } from '../util/extensions.js';
export interface CommandIndexOptions {
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionString[];
    automaticMessageParsing?: boolean;
}
export declare type CommandResolvable = Command | CommandDetails | Command[] | CommandDetails[];
export default class CommandIndex {
    client: Client;
    prefix: string;
    allowBots: boolean;
    groups: Collection<string>;
    index: Index<string, Command>;
    permissions: Collection<PermissionString>;
    constructor(client: Client, options?: CommandIndexOptions);
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
    deleteCommands(...commands: Command[] | string[]): this;
    deleteGroup(group: string): this;
    deleteGroups(...groups: string[] | string[][]): this;
}
