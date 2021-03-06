import { Client as DJSClient, ClientOptions as DJSClientOptions, Message } from 'discord.js';
import CommandManager, { CommandManagerOptions } from '../structs/CommandManager.js';
import SlashCommandManager from '../structs/SlashCommandManager.js';
export interface ClientOptions extends DJSClientOptions, CommandManagerOptions {
    token?: string;
}
export default class Client extends DJSClient {
    commands: CommandManager;
    slashCommands: SlashCommandManager;
    constructor(options: ClientOptions);
    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    parseMessage(message: Message): Promise<any>;
}
