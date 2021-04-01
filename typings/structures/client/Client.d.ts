import { SlashBase } from '../slash/SlashBase';
import { Client as DJSClient } from 'discord.js';
import { ClientOptions as DJSClientOptions } from 'discord.js';
import { CommandManager, CommandManagerOptions } from '../commands/CommandManager';
export interface ClientOptions extends CommandManagerOptions, DJSClientOptions {
    token: string;
}
export declare class Client extends DJSClient {
    #private;
    constructor(options: ClientOptions);
    logout(): void;
    get commands(): CommandManager;
    get slash(): SlashBase;
    get discord(): any;
}
