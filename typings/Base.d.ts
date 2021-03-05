import { Client, ClientOptions } from 'discord.js';
export interface BaseOptions {
    /**
     * - A valid Discord bot token
     */
    token: string;
    /**
     * - DiscordJS ClientOptions interface
     */
    clientOptions?: ClientOptions;
}
export declare class Base {
    #private;
    constructor(options: BaseOptions);
    login(): Promise<Client | void>;
    logOut(): void;
    get client(): Client;
}
