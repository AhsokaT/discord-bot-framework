import { ApplicationCommandData, ApplicationCommand, CommandInteraction, ApplicationCommandOption, GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Invite, Role } from 'discord.js';
import Client from '../../client/Client.js';
import { Index } from '../../util/extensions.js';
import { noop } from '../../util/util.js';

export type ApplicationCommandCallback = (interaction: CommandInteraction, client: Client) => void;

export type ApplicationCommandResolvable = ApplicationCommandConstructor | ApplicationCommandConstructorOptions;

export interface FetchOptions {
    id?: string;
    guild?: GuildResolvable;
    omitCache?: boolean
}

export default class SlashCommandIndex {
    // public cache: Index<string, ApplicationCommand>;
    public callbacks: Index<string, ApplicationCommandCallback>;

    constructor(public client: Client) {
        this.client = client;
        this.callbacks = new Index();
        // this.cache = new Index();

        // client.on('applicationCommandCreate', command => this.cache.set(command.id, command));
        // client.on('applicationCommandDelete', command => this.cache.delete(command.id));
        // client.on('applicationCommandUpdate', (oldCommand, newCommand) => this.cache.set(newCommand.id, newCommand));
        client.on('interaction', interaction => {
            if (!interaction.isCommand()) return;

            const callback = this.callbacks.get(interaction.id);

            if (callback) callback(interaction, client);
        });
    }

    public async create(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | undefined> {
        let posted: ApplicationCommand | null = null;

        if (guild) {
            const resolvedGuild = await resolveGuild(guild, this.client);

            if (!resolvedGuild) return;

            posted = await resolvedGuild.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        } else {
            if (!this.client.readyAt) {
                this.client.on('ready', async () => {
                    if (!this.client.application) return;

                    posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
                });
            } else {
                if (!this.client.application) return;

                posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
            }
        }

        if (!posted) return;

        if (command.callback) this.callbacks.set(posted.id, command.callback);

        return posted;
    }

    public async fetch(options: FetchOptions) {
        if (!options) return this.client.application?.commands.fetch();

        if (options.guild) {
            const guild = await resolveGuild(options.guild, this.client);

            if (guild) return guild.commands.fetch(options.id, true, Boolean(options.omitCache ?? true));
        } else if (options.id) {
            return this.client.application?.commands.fetch(options.id, true, Boolean(options.omitCache ?? true));
        }
    }
}

export interface ApplicationCommandConstructorOptions extends ApplicationCommandData {
    callback?: ApplicationCommandCallback;
}

export class ApplicationCommandConstructor implements ApplicationCommandData {
    public name: string;
    public description: string;
    public options: ApplicationCommandOption[];
    public defaultPermission: boolean;
    public callback?: ApplicationCommandCallback;

    constructor(options?: ApplicationCommandConstructorOptions) {
        this.options = [];

        this.setName(options?.name ?? '');
        this.setDescription(options?.description ?? '');
        this.setCallback(options?.callback ?? noop);

        if (options && Array.isArray(options?.options)) this.addOptions(...options.options);
    }

    public setName(name: string) {
        if (typeof name !== 'string') throw new TypeError(`${typeof name} is not a string`);

        this.name = name;

        return this;
    }

    public setDescription(description: string) {
        if (typeof description !== 'string') throw new TypeError(`${typeof description} is not a string`);

        this.description = description;

        return this;
    }

    public setDefaultPermission(defaultPermission = true) {
        this.defaultPermission = Boolean(defaultPermission);

        return this;
    }

    public addOptions(...options: ApplicationCommandOption[]) {
        this.options.push(...options);

        return this;
    }

    public setCallback(callback: ApplicationCommandCallback) {
        this.callback = callback;
    }

    public normalise(): ApplicationCommandData {
        return { ...this };
    }

    public toJSON() {
        return JSON.stringify(this.normalise());
    }
}

function resolveGuild(guild: Guild | GuildEmoji | GuildMember | GuildChannel | Role, client: Client): Guild;
function resolveGuild(guild: Invite, client: Client): Guild | undefined;
function resolveGuild(guild: string, client: Client): Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined>;
function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined> {
    if (guild instanceof Guild) return guild;
    if (guild instanceof GuildEmoji || guild instanceof GuildMember || guild instanceof GuildChannel || guild instanceof Role) return guild.guild;
    if (guild instanceof Invite) {
        if (guild.guild) return guild.guild;

        return;
    }

    return client.guilds.fetch(guild);
}