import { ClientApplication, NewsChannel, TextChannel } from 'discord.js';
import Client from '../../client/Client.js';
import { Index } from '../../util/extensions.js';
import APISlashCommand, { APIApplicationCommandDetails, SlashCallback, SlashCommand } from './SlashCommand.js';
import { EventEmitter } from 'events';
import { Interaction } from './Interaction.js';

export default class SlashCommandIndex extends EventEmitter {
    public client: Client;
    public cache: Index<string, SlashCommand>;
    public callbacks: Index<string, SlashCallback>;
    public application: ClientApplication | null;

    constructor(client: Client) {
        super();

        this.client = client;
        this.cache = new Index();
        this.callbacks = new Index();
        this.application = null;

        // @ts-expect-error
        this.client.ws.on('INTERACTION_CREATE', async interaction => {
            if (!this.application) this.application = await this.client.fetchApplication();

            const channel = await this.client.channels.fetch(interaction.channel_id).catch(() => undefined);
            if (!(channel instanceof TextChannel || channel instanceof NewsChannel) && channel !== undefined) return;
            const member = await channel?.guild.members.fetch(interaction.member.user.id).catch(() => undefined) ?? undefined;
            const command = await this.fetch(interaction.data.id, interaction.guild_id);

            if (!command) return;

            const ResolvedInteraction = new Interaction({
                member,
                channel,
                client: this.client,
                id: interaction.id,
                token: interaction.token,
                guildID: interaction.guild_id,
                options: Array.isArray(interaction.data.options) ? new Index(...interaction.data.options.map(opt => [ opt.name, opt.value ])) : new Index(),
                application: this.application,
                command: command
            });

            this.emit('commandCall', ResolvedInteraction, this.client);
        });
    }

    on(event: 'commandCall', listener: SlashCallback): this;
    on(event: 'commandUpdate', listener: (previous: SlashCommand, updated: SlashCommand) => void): this;
    on(event: 'commandDelete', listener: (command: SlashCommand) => void): this;
    on(event: 'commandCreate', listener: (command: SlashCommand) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }

    once(event: 'commandCall', listener: SlashCallback): this;
    once(event: 'commandUpdate', listener: (previous: SlashCommand, updated: SlashCommand) => void): this;
    once(event: 'commandDelete', listener: (command: SlashCommand) => void): this;
    once(event: 'commandCreate', listener: (command: SlashCommand) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void) {
        return super.once(event, listener);
    }

    emit(event: 'commandCall', interaction: Interaction, client: Client): boolean;
    emit(event: 'commandUpdate', previous: SlashCommand, updated: SlashCommand): boolean;
    emit(event: 'commandDelete', command: SlashCommand): boolean;
    emit(event: 'commandCreate', command: SlashCommand): boolean;
    emit(event: string | symbol, ...args: any[]) {
        return super.emit(event, ...args);
    }

    private updateCache(...commands: SlashCommand[]) {
        commands.forEach(command => this.cache.set(command.id, command));

        return this.cache;
    }

    /**
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand[]>}
     */
    async fetchAll(guildID?: string): Promise<SlashCommand[]> {
        if (!this.application) this.application = await this.client.fetchApplication();

        const res = guildID ?
        await this.client.discord.applications(this.application.id).guilds(guildID).commands.get() :
        await this.client.discord.applications(this.application.id).commands.get();

        const commands = res ? [ ...await res.json() ].map(command => new SlashCommand(this.client, { guildID, ...command })) : [];

        this.updateCache(...commands);

        return commands;
    }

    /**
     * 
     * @param {string} id The ID of a slash command
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | null>}
     */
    async fetch(id: string, guildID?: string): Promise<SlashCommand | null> {
        if (!this.application) this.application = await this.client.fetchApplication();

        if (this.cache.has(id)) return this.cache.get(id) ?? null;

        const res = guildID ?
        await this.client.discord.applications(this.application.id).guilds(guildID).commands(id).get() :
        await this.client.discord.applications(this.application.id).commands(id).get();

        const command = res ? new SlashCommand(this.client, await res.json()) : null;

        if (command) this.updateCache(command);

        return command;
    }

    /**
     * Post a new slash command to Discord.
     * 
     * If an existing command has the same name then the existing command will be returned.
     * @param {SlashCommand | SlashCommandOptions} command An instance of the slash command class or an object of type SlashCommandOptions
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | undefined>}
     */
    async post(command: APISlashCommand | APIApplicationCommandDetails): Promise<SlashCommand | undefined> {
        if (!this.application) this.application = await this.client.fetchApplication();

        if (!(command instanceof APISlashCommand)) return await this.post(new APISlashCommand(command));

        await this.fetchAll(command.guildID);

        if (!command.name) throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description) throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');

        const existing = this.cache.array().find(existing => existing.name === command.name && existing.guildID === command.guildID);

        if (existing) {
            this.emit('commandCreate', existing);

            return existing;
        }

        let res = command.guildID ?
        await this.client.discord.applications(this.application.id).guilds(command.guildID).commands.post({ body: command.toJSON() }) :
        await this.client.discord.applications(this.application.id).commands.post({ body: command.toJSON() });

        if (!res) return;

        const posted = new SlashCommand(this.client, { guildID: command.guildID, ...await res.json() });

        this.emit('commandCreate', posted);

        return this.updateCache(posted).get(posted.id);
    }

    async edit(command: SlashCommand, details: Omit<APIApplicationCommandDetails, 'guildID'>) {
        if (!this.application) this.application = await this.client.fetchApplication();

        if (!(command instanceof SlashCommand)) return;

        const res = command.guildID ?
        await this.client.discord.applications(this.application.id).guilds(command.guildID).commands(command.id).patch({ body: details }) :
        await this.client.discord.applications(this.application.id).commands(command.id).patch({ body: details });

        if (res.status !== 200) return;

        const edited = new SlashCommand(this.client, await res.json());

        this.emit('commandUpdate', command, edited);

        return this.updateCache(edited).get(edited.id);
    }

    async delete(command: SlashCommand): Promise<SlashCommand | undefined> {
        if (!this.application) this.application = await this.client.fetchApplication();

        if (!(command instanceof SlashCommand)) return;

        const deleted = command.guildID ?
        await this.client.discord.applications(this.application.id).guilds(command.guildID).commands(command.id).delete() :
        await this.client.discord.applications(this.application.id).commands(command.id).delete();

        if (deleted.status !== 204) return;

        this.cache.delete(command.id);

        this.emit('commandDelete', command);

        return command;
    }

    /**
     * @param command An instance of SlashCommand or the ID of a slash command
     * @param callback The function to be called when the command is used
     */
    setCallback(command: SlashCommand | string, callback: SlashCallback) {
        const id = command instanceof SlashCommand ? command.id : command;

        if (typeof callback !== 'function') return this;

        this.callbacks.set(id, callback);

        return this;
    }
}