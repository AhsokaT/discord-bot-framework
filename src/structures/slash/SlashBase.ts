import { SlashCommand } from './Slash.js';
import { post, del, get, patch } from 'superagent';
import { SlashCallback, Snowflake } from './SlashTypes.js';
import { Client } from 'discord.js';

export class SlashBase {
    #token: string;
    #client: Client;
    #appID?: string;
    #guildID?: string;
    #callbacks: { name: string; callback: SlashCallback; }[];

    constructor(client: Client, token: string) {
        this.#client = client;
        this.#token = token;
    }

    private async endpoint(): Promise<string> {
        if (!this.#appID) this.#appID = (await this.#client.fetchApplication()).id;

        return `https://discord.com/api/v8/applications/${this.#appID}/${this.#guildID ? `guilds/${this.#guildID}/commands` : 'commands'}`;
    }

    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    public guild(id: Snowflake): SlashBase {
        if (typeof id === 'string') this.#guildID = id;

        return this;
    }

    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    public global(): SlashBase {
        this.#guildID = undefined;

        return this;
    }

    /**
     * @returns an array of your slash commands.
     */
    public async all(): Promise<SlashCommand[]> {
        const endpoint = await this.endpoint();
        console.log(endpoint);
        const res = await get(endpoint).set('Authorization', 'Bot ' + this.#token).catch(console.error);

        return res ? res.body.map(i => new SlashCommand(i)) : [];
    }

    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    public async post(command: SlashCommand): Promise<SlashCommand | undefined> {
        const endpoint = await this.endpoint();
        console.log(endpoint);
        if (!(command instanceof SlashCommand)) command = new SlashCommand(command);

        if (!command.name) throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description) throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');

        const postedCommand = await post(endpoint).send(command.toJSON()).set('Content-Type', 'application/json').set('Authorization', 'Bot ' + this.#token).catch(console.error);

        if (!postedCommand) return;

        return new SlashCommand(postedCommand.body);
    }

    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    public async delete(command: string): Promise<SlashCommand | undefined> {
        if (!command) throw new Error('You must provide the name or ID of a slash command.');
        const endpoint = await this.endpoint();

        const toDelete = (await this.all()).find(i => i.name === command || i.id === command);

        if (!toDelete) return;

        const deleted = await del(endpoint + `/${toDelete.id}`).set('Authorization', 'Bot ' + this.#token).catch(console.error);

        if (deleted && deleted.status === 204) return toDelete;
    }
}