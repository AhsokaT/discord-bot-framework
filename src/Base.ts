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

export class Base {
    #token: string;
    #client: Client;

    constructor(options: BaseOptions) {
        if (!options?.token) throw new Error('No argument for parameter \'BaseOptions.token\' was provided');

        this.#token = options.token;
        this.#client = new Client(options.clientOptions);

        this.login();
    }

    async login(): Promise<Client | void> {
        const res = await this.#client.login(this.#token).catch(console.error);

        if (res) return this.#client;
    }

    logOut(): void {
        this.#client.destroy();
    }

    get client() {
        return this.#client;
    }
}