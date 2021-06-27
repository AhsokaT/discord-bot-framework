import { ApplicationCommand as DJSApplicationCommand, Guild, SnowflakeUtil } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { noop } from '../util/util.js';
import { APISlashCommandCallback } from './APISlashCommand.js';
import ApplicationCommandOption from './SlashCommandOption.js';

type SlashCommandResolvable =
    | SlashCommand
    | Snowflake;

class SlashCommand {
    public id: Snowflake;
    public name: string;
    public description: string;
    public defaultPermission: boolean;
    public options: Collection<ApplicationCommandOption>;
    public callback: APISlashCommandCallback | null;
    public guild: Guild | null;
    public deleted: boolean;

    constructor(public client: Client, command: any, callback: APISlashCommandCallback | null = null) {
        this.client = client;
        this.options = new Collection();

        const { id, name, description, defaultPermission, guild, options, deleted } = command;

        this.id = id;
        this.name = name;
        this.guild = guild;
        this.description = description;
        this.defaultPermission = defaultPermission;
        this.callback = callback;
        this.deleted = deleted;

        options.forEach(option => this.options.add(new ApplicationCommandOption(option)));

        this.client.slashCommands.cache.set(this.id, this);
    }

    get createdAt(): Date {
        return SnowflakeUtil.deconstruct(this.id).date;
    }

    public async fetch(): Promise<SlashCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        const manager = this.guild ? this.guild.commands : this.client.application.commands;

        const fetched = await manager.fetch(this.id).catch(noop);

        return fetched ? new SlashCommand(this.client, { deleted: false, ...fetched }, this.callback) : null;
    }

    public async delete(): Promise<SlashCommand | null> {
        return this.client.slashCommands.delete(this);
    }
}

export {
    SlashCommandResolvable
}

export default SlashCommand;