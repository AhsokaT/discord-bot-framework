import { Client as DJSClient, ClientOptions as DJSClientOptions, Message } from 'discord.js';
import CommandIndex, { CommandIndexOptions } from '../structs/Commands/CommandIndex.js';
import SlashCommandIndex from '../structs/SlashCommands/ApplicationCommands';
export interface ClientOptions extends DJSClientOptions, CommandIndexOptions {
    token?: string;
}
export default class Client extends DJSClient {
    commands: CommandIndex;
    applicationCommands: SlashCommandIndex;
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
