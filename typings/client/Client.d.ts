import { BaseManager, Client as DJSClient, ClientOptions as DJSClientOptions, Snowflake, GuildResolvable, Message, GuildCreateOptions } from 'discord.js';
import CommandIndex, { CommandIndexOptions } from '../structs/CommandIndex.js';
import ApplicationCommandManager, { GuildExtension as Guild } from '../structs/ApplicationCommands';
export interface ClientOptions extends DJSClientOptions, CommandIndexOptions {
    token?: string;
}
interface GuildManager extends BaseManager<Snowflake, Guild, GuildResolvable> {
    create(name: string, options?: GuildCreateOptions): Promise<Guild>;
    fetch(id: Snowflake, cache?: boolean, force?: boolean): Promise<Guild>;
}
export default class Client extends DJSClient {
    guilds: GuildManager;
    commands: CommandIndex;
    applicationCommands: ApplicationCommandManager;
    /**
     * @param {ClientOptions} options
     */
    constructor(options: ClientOptions);
    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    parseMessage(message: Message): Promise<any>;
    get discord(): any;
}
export {};
