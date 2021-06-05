import { Client as DJSClient, ClientOptions as DJSClientOptions, Message, ClientEvents } from 'discord.js';
import CommandIndex, { CommandIndexOptions } from '../structs/CommandIndex.js';
import ApplicationCommandManager from '../structs/ApplicationCommands';
import Command from '../structs/Command.js';
export interface ClientOptions extends DJSClientOptions, CommandIndexOptions {
    token?: string;
}
export default class Client extends DJSClient {
    commands: CommandIndex;
    applicationCommands: ApplicationCommandManager;
    /**
     * @param {ClientOptions} options
     */
    constructor(options: ClientOptions);
    on(event: 'commandDelete', listener: (command: Command) => void): this;
    on(event: 'commandCall', listener: (command: Command, message: Message) => void): this;
    on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    parseMessage(message: Message): Promise<any>;
}
