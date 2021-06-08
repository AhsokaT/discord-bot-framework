import { Client as DJSClient, ClientOptions as DJSClientOptions, Message, ClientEvents } from 'discord.js';
import CommandManager, { CommandManagerOptions } from '../structs/CommandManager.js';
import ApplicationCommandManager from '../structs/ApplicationCommandManager';
export interface ClientOptions extends DJSClientOptions, CommandManagerOptions {
    token?: string;
}
export default class Client extends DJSClient {
    commands: CommandManager;
    applicationCommands: ApplicationCommandManager;
    /**
     * @param {ClientOptions} options
     */
    constructor(options: ClientOptions);
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    parseMessage(message: Message): Promise<any>;
}
