import { GuildResolvable } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import SlashCommand, { SlashCommandResolvable, SlashCommandOptions } from './SlashCommand.js';
import DiscordSlashCommand, { DiscordSlashCommandResolvable } from './DiscordSlashCommand.js';
import { resolveGuild } from '../util/util.js';

class SlashCommandManager {
    public cache: Index<Snowflake, DiscordSlashCommand>;

    constructor(public client: Client) {
        this.client = client;
        this.cache = new Index();

        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;

            const command = this.cache.get(interaction.commandID);

            if (command?.callback)
                command.callback.bind(command)(interaction, command, this.client);
        });
    }

    public async create(command: SlashCommandResolvable): Promise<DiscordSlashCommand> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof SlashCommand))
            return this.create(new SlashCommand(command));

        const guild = command.guild ? await resolveGuild(this.client, command.guild) : null;

        const manager = guild ? guild.commands : this.client.application.commands;

        const existing = (await manager.fetch()).find(({ name }) => name === command.name);

        if (existing)
            return this.edit(new DiscordSlashCommand(this.client, existing), command);

        const posted = await manager.create(command.data);

        return new DiscordSlashCommand(this.client, { ...command, ...posted });
    }

    public async edit(command: DiscordSlashCommandResolvable, data: Partial<SlashCommandOptions>): Promise<DiscordSlashCommand> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof DiscordSlashCommand))
            return this.edit(await this.fetch(command), data);

        const manager = command.guild ? command.guild.commands : this.client.application.commands;

        const newCommand = new SlashCommand({ ...command, ...data });

        const editted = await manager.edit(command.id, newCommand.data);

        return new DiscordSlashCommand(this.client, { ...command, ...editted });
    }

    public async delete(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (!(command instanceof DiscordSlashCommand))
            return this.delete(await this.fetch(command, guild));

        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(this.client, guild);

        const manager = guild ? guild.commands : this.client.application.commands;

        const deleted = await manager.delete(command.id);

        return deleted ? new DiscordSlashCommand(this.client, { ...command, ...deleted, deleted: true }) : null;
    }

    public async fetch(): Promise<Index<Snowflake, DiscordSlashCommand>>;
    public async fetch(command: null, guild: GuildResolvable): Promise<Index<Snowflake, DiscordSlashCommand>>;
    public async fetch(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand>;
    public async fetch(command?: DiscordSlashCommandResolvable | null, guild?: GuildResolvable): Promise<any> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        if (command instanceof DiscordSlashCommand && command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(this.client, guild);

        const manager = guild ? guild.commands : this.client.application.commands;

        if (command)
            return new DiscordSlashCommand(this.client, await manager.fetch(command instanceof DiscordSlashCommand ? command.id : command));

        return new Index([ ...(await manager.fetch()).map(i => new DiscordSlashCommand(this.client, i)).entries() ]);
    }
}

export default SlashCommandManager;