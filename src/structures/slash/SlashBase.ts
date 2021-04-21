import { SlashCommand } from './Slash.js';
import { NewsChannel, TextChannel } from 'discord.js';
import { Client } from '../client/Client.js';
import { Interaction, InteractionOptions, InteractionOption } from './Interaction.js';

export class SlashBase {
    #client: Client;
    #applicationID: string;
    #commands: SlashCommand[] = [];
    #guildID: string | undefined;

    constructor(client: Client) {
        this.#client = client;

        // @ts-expect-error
        client.ws.on('INTERACTION_CREATE', async i => {
            const channel = await this.#client.channels.fetch(i.channel_id).catch(console.error);
            if (!channel || !(channel instanceof TextChannel || channel instanceof NewsChannel)) return;

            const member = await channel.guild.members.fetch(i.member.user.id).catch(console.error);
            if (!member) return;

            const command = this.#commands.find(command => command.name === i.data.name);

            if (command && command.callback) command.callback(new Interaction(
                this.#client, channel, member, i.id, i.token, i.application_id,
                new InteractionOptions(Array.isArray(i.data?.options) ? i.data.options?.map(i => new InteractionOption(i)) : [])),
                this.#client
            );
        });
    }

    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    public guild(id: string): SlashBase {
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
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        const commands = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.get() :
        await this.#client.discord.applications(this.#applicationID).commands.get();

        return commands ? (await commands.json()).map(command => new SlashCommand(command)) : [];
    }

    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    public async post(command: SlashCommand): Promise<SlashCommand | undefined> {
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        if (!(command instanceof SlashCommand)) return;

        if (!command.name) throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description) throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');

        const existing = (await this.all()).find(cmd => cmd.name === command.name);

        if (existing) {
            if (typeof command.callback === 'function') existing.setCallback(command.callback);

            this.#commands.push(existing);

            return existing;
        }

        let posted = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.post({ body: command.toJSON() }) :
        await this.#client.discord.applications(this.#applicationID).commands.post({ body: command.toJSON() });

        if (!posted) return;

        posted = new SlashCommand(await posted.json());
        if (typeof command.callback === 'function') posted.setCallback(command.callback);

        this.#commands.push(posted);

        return posted;
    }

    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    public async delete(command: string): Promise<SlashCommand | undefined> {
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        if (!command) throw new Error('You must provide the name or ID of a slash command.');

        const existing = (await this.all()).find(i => i.name === command || i.id === command);

        console.log(existing);

        if (!existing) return;

        const deleted = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands(existing.id).delete() :
        await this.#client.discord.applications(this.#applicationID).commands(existing.id).delete();

        console.log(deleted.status);
        if (deleted && deleted.status === 204) return existing;
    }
}