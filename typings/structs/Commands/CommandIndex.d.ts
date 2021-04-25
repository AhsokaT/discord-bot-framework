import { PermissionString } from 'discord.js';
import Client from '../../client/Client.js';
import Command, { CommandDetails } from './Command.js';
import { Group, Index } from '../../util/extensions.js';
export interface CommandIndexOptions {
    groups?: string[];
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionString[];
    automaticMessageParsing?: boolean;
}
export declare type CommandResolvable = Command | CommandDetails;
export default class CommandIndex {
    client: Client;
    prefix: string;
    allowBots: boolean;
    groups: Group<string>;
    index: Index<string, Command>;
    permissions: PermissionString[];
    constructor(client: Client, options?: CommandIndexOptions);
    /**
     * @param prefix A command prefix the bot should look for
     */
    setPrefix(prefix: string): this;
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     */
    indexCommand(command: CommandResolvable): this;
    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     */
    indexCommands(...commands: CommandResolvable[]): this;
    indexDefaults(): this;
    indexGroup(group: string): this;
    indexGroups(...groups: string[]): this;
    removeCommands(...commands: (Command | string)[]): this;
    removeGroup(group: string): this;
    removeGroups(...groups: string[]): this;
}
