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
        if (!options?.token) throw new Error('No argument for \'BaseOptions.token\' was provided');

        this.#token = options.token;
        this.#client = new Client(options.clientOptions);

        this.login().then(client => console.log(`${client?.user?.username} is online!`), console.error);
    }

    public async login(): Promise<Client | undefined> {
        const res = await this.#client.login(this.#token).catch(console.error);

        if (res) return this.#client;
    }

    public logout(): void {
        this.#client.destroy();
    }

    get client() {
        return this.#client;
    }
}