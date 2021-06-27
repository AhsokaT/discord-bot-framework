import { GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Invite, Role } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import APISlashCommand, { APISlashCommandResolvable, APISlashCommandOptions } from './APISlashCommand.js';
import ApplicationCommand, { ApplicationCommandResolvable } from './ApplicationCommand.js';

class ApplicationCommandManager {
    public cache: Index<Snowflake, ApplicationCommand>;

    constructor(public client: Client) {
        this.client = client;
        this.cache = new Index();

        client.on('interaction', interaction => {
            console.log(`Interaction: ${interaction.isCommand()}`);
            if (!interaction.isCommand())
                return;

            const command = this.cache.get(interaction.commandID);

            if (command && command.callback)
                command.callback(interaction, command, this.client);
        });
    }

    public async post(command: APISlashCommandResolvable): Promise<ApplicationCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof APISlashCommand))
            return this.post(new APISlashCommand(command));

        const guild = command.guild ? await resolveGuild(command.guild, this.client) : null;

        const manager = guild ? guild.commands : this.client.application.commands;

        const existing = (await manager.fetch()).find(i => i.name === command.name);

        if (existing)
            return this.edit(new ApplicationCommand(this.client, { ...existing, deleted: false }, command.callback), command);

        const posted = await manager.create(command.toAPIObject());

        return posted ? new ApplicationCommand(this.client, { ...posted, deleted: false }, command.callback) : null;
    }

    public async edit(command: ApplicationCommand, data: APISlashCommandOptions): Promise<ApplicationCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof ApplicationCommand))
            throw new TypeError(`Type ${typeof command} is not assignable to type 'ApplicationCommand'.`);

        const manager = command.guild ? command.guild.commands : this.client.application.commands;

        const editted = await manager.edit(command.id, new APISlashCommand({ ...command, ...data }).toAPIObject());

        return editted ? new ApplicationCommand(this.client, { ...editted, deleted: false }, command.callback) : null;
    }

    public async delete(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof ApplicationCommand)) {
            const fetched = await this.fetch(command, guild);

            return fetched ? this.delete(fetched, guild) : null;
        }

        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);
        
        const manager = guild ? guild.commands : this.client.application.commands;

        const deleted = manager.delete(command.id);

        return deleted ? new ApplicationCommand(this.client, { ...deleted, deleted: true }, command.callback) : null;
    }

    public async fetch(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (command instanceof ApplicationCommand && command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);

        const manager = guild ? guild.commands : this.client.application.commands;

        const fetched = await manager.fetch(command instanceof ApplicationCommand ? command.id : command);

        const callback = this.cache.get(fetched.id)?.callback;

        return fetched ? new ApplicationCommand(this.client, { ...fetched, deleted: false }, callback ?? null) : null;
    }
}

export default ApplicationCommandManager;

function resolveGuild(guild: Guild | GuildEmoji | GuildMember | GuildChannel | Role, client: Client): Guild;
function resolveGuild(guild: Invite, client: Client): Guild | undefined;
function resolveGuild(guild: Snowflake, client: Client): Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined> {
    if (guild instanceof Guild)
        return guild;

    if (guild instanceof GuildEmoji || guild instanceof GuildMember || guild instanceof GuildChannel || guild instanceof Role)
        return guild.guild;

    if (guild instanceof Invite) {
        if (guild.guild)
            return guild.guild;
        else
            return;
    }

    return client.guilds.fetch(guild);
}