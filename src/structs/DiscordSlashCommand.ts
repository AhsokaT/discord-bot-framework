import { Guild, SnowflakeUtil, ApplicationCommand } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { SlashCommandCallback, SlashCommandOptions } from './SlashCommand.js';
import SlashCommandOption from './SlashCommandOption.js';

interface DiscordSlashCommandData extends Omit<ApplicationCommand, 'delete' | 'edit' | 'fetch' | 'fetchPermissions' | 'toJSON' | 'valueOf' | 'setPermissions'> {
    callback?: SlashCommandCallback;
    deleted?: boolean;
}

type DiscordSlashCommandResolvable =
    | DiscordSlashCommand
    | Snowflake;

class DiscordSlashCommand {
    public id: Snowflake;
    public name: string;
    public description: string;
    public defaultPermission: boolean;
    public options: Collection<SlashCommandOption>;
    public callback: SlashCommandCallback;
    public guild: Guild | null;
    public deleted: boolean;

    constructor(public client: Client, data: DiscordSlashCommandData) {
        this.client = client;
        this.options = new Collection();

        const { id, name, description, defaultPermission, guild, options, deleted = false, callback } = data;

        this.id = id;
        this.name = name;
        this.guild = guild;
        this.deleted = deleted;
        this.description = description;
        this.defaultPermission = defaultPermission;
        this.callback = callback ?? this.client.slashCommands.cache.get(this.id)?.callback ?? ((interaction) => interaction.reply({ content: '🛠️ This command is **under construction** 🏗️', ephemeral: true }));

        options.forEach(option => this.options.add(new SlashCommandOption(option)));

        if (this.deleted)
            this.client.slashCommands.cache.delete(this.id);
        else
            this.client.slashCommands.cache.set(this.id, this);
    }

    get createdAt(): Date {
        return SnowflakeUtil.deconstruct(this.id).date;
    }

    public async fetch(): Promise<DiscordSlashCommand | null> {
        return this.client.slashCommands.fetch(this);
    }

    public async delete(): Promise<DiscordSlashCommand | null> {
        return this.client.slashCommands.delete(this);
    }

    public async edit(data: SlashCommandOptions): Promise<DiscordSlashCommand> {
        return this.client.slashCommands.edit(this, data);
    }
}

export {
    DiscordSlashCommandResolvable
}

export default DiscordSlashCommand;