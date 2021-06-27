import { ApplicationCommand as DJSApplicationCommand, Guild, SnowflakeUtil } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { noop } from '../util/util.js';
import { SlashCommandCallback } from './SlashCommand.js';
import ApplicationCommandOption from './SlashCommandOption.js';

type ApplicationCommandResolvable =
    | ApplicationCommand
    | Snowflake;

class ApplicationCommand {
    public id: Snowflake;
    public name: string;
    public description: string;
    public defaultPermission: boolean;
    public options: Collection<ApplicationCommandOption>;
    public callback: SlashCommandCallback | null;
    public guild: Guild | null;
    public deleted: boolean;

    constructor(public client: Client, command: any, callback: SlashCommandCallback | null = null) {
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

    public async fetch(): Promise<ApplicationCommand | null> {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');

        const manager = this.guild ? this.guild.commands : this.client.application.commands;

        const fetched = await manager.fetch(this.id).catch(noop);

        return fetched ? new ApplicationCommand(this.client, { deleted: false, ...fetched }, this.callback) : null;
    }

    public async delete(): Promise<ApplicationCommand | null> {
        return this.client.slashCommands.delete(this);
    }
}

export {
    ApplicationCommandResolvable
}

export default ApplicationCommand;