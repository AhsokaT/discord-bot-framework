import { GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Invite, Role } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import SlashCommand, { SlashCommandResolvable, SlashCommandOptions } from './SlashCommand.js';
import DiscordSlashCommand, { DiscordSlashCommandResolvable } from './DiscordSlashCommand.js';

class DiscordSlashCommandManager {
    public cache: Index<Snowflake, DiscordSlashCommand>;

    constructor(public client: Client) {
        this.client = client;
        this.cache = new Index();

        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;

            const command = this.cache.get(interaction.commandID);

            if (command?.callback)
                command.callback(interaction, command, this.client);
        });
    }

    public async create(command: SlashCommandResolvable): Promise<DiscordSlashCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof SlashCommand))
            return this.create(new SlashCommand(command));

        const guild = command.guild ? await resolveGuild(command.guild, this.client) : null;

        const manager = guild ? guild.commands : this.client.application.commands;

        const existing = (await manager.fetch()).find(i => i.name === command.name);

        if (existing)
            return this.edit(new DiscordSlashCommand(this.client, existing), command);

        const posted = await manager.create(command.toAPIObject());

        return posted ? new DiscordSlashCommand(this.client, { ...command, ...posted }) : null;
    }

    public async edit(command: DiscordSlashCommand, data: SlashCommandOptions): Promise<DiscordSlashCommand> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof DiscordSlashCommand))
            throw new TypeError(`Type ${typeof command} is not assignable to type 'DiscordSlashCommand'.`);

        const manager = command.guild ? command.guild.commands : this.client.application.commands;

        const newCommand = new SlashCommand({ ...command, ...data });

        const editted = await manager.edit(command.id, newCommand.toAPIObject());

        return new DiscordSlashCommand(this.client, { ...newCommand, ...editted });
    }

    public async delete(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof DiscordSlashCommand)) {
            const fetched = await this.fetch(command, guild);

            return fetched ? this.delete(fetched, guild) : null;
        }

        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);

        const manager = guild ? guild.commands : this.client.application.commands;

        const deleted = await manager.delete(command.id);

        return deleted ? new DiscordSlashCommand(this.client, { ...command, ...deleted, deleted: true }) : null;
    }

    public async fetch(): Promise<Index<Snowflake, DiscordSlashCommand>>;
    public async fetch(command: null, guild: GuildResolvable): Promise<Index<Snowflake, DiscordSlashCommand>>;
    public async fetch(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand | null>;
    public async fetch(command?: DiscordSlashCommandResolvable | null, guild?: GuildResolvable): Promise<any> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (command instanceof DiscordSlashCommand && command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);

        const manager = guild ? guild.commands : this.client.application.commands;

        if (command)
            return new DiscordSlashCommand(this.client, await manager.fetch(command instanceof DiscordSlashCommand ? command.id : command));

        return new Index([ ...(await manager.fetch()).map(i => new DiscordSlashCommand(this.client, i)).entries() ]);
    }
}

export default DiscordSlashCommandManager;

function resolveGuild(guild: Guild | GuildEmoji | GuildMember | GuildChannel | Role, client: Client): Guild;
function resolveGuild(guild: Snowflake | Invite, client: Client): Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined> {
    if (guild instanceof Guild)
        return guild;

    if (guild instanceof GuildEmoji || guild instanceof GuildMember || guild instanceof GuildChannel || guild instanceof Role)
        return guild.guild;

    if (guild instanceof Invite) {
        if (guild.guild)
            return guild.guild.fetch();
        else
            return;
    }

    return client.guilds.fetch(guild);
}