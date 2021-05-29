import { Structures, GuildApplicationCommandManager as BaseGuildApplicationCommandManager, ApplicationCommandData, ApplicationCommand, CommandInteraction, ApplicationCommandOption, GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Invite, Role, ClientApplication } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from '../util/extensions.js';
import { noop } from '../util/util.js';

export type ApplicationCommandCallback = (interaction: CommandInteraction, client: Client) => void;

export type ApplicationCommandResolvable = ApplicationCommandConstructor | ApplicationCommandConstructorOptions;

export default class ApplicationCommandManager {
    public callbacks: Index<string, ApplicationCommandCallback>;

    constructor(public client: Client) {
        this.client = client;
        this.callbacks = new Index();

        client.on('interaction', interaction => {
            if (!interaction.isCommand()) return;

            const callback = this.callbacks.get(interaction.commandID);

            if (callback) callback(interaction, client);
        });
    }

    public async create(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | undefined> {
        if (!this.client.application) throw new Error('This method must be used inside the ready event');

        let posted: ApplicationCommand | undefined = undefined;

        if (guild) {
            const resolved = await resolveGuild(guild, this.client);

            if (!resolved) return;

            const existing = await resolved.commands.fetch();

            if (existing.find(item => item.name === command.name)) {
                console.log('returned existing');

                return existing.find(item => item.name === command.name);
            }

            posted = await resolved.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        } else {
            const existing = await this.client.application.commands.fetch();

            if (existing.find(item => item.name === command.name)) {
                console.log('returned existing');

                return existing.find(item => item.name === command.name);
            }

            posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        }

        if (!posted) return;

        if (command.callback) this.callbacks.set(posted.id, command.callback);

        return posted;
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
        if (typeof callback !== 'function') throw new TypeError(`${typeof callback} is not a function`);       

        this.callback = callback;

        return this;
    }

    public normalise(): ApplicationCommandData {
        const { callback, ...self } = this;

        return self;
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

class GuildApplicationCommandManager extends BaseGuildApplicationCommandManager {
    constructor(guild: Guild, iterable?: Iterable<any>) {
        super(guild, iterable);
    }

    public async create(command: ApplicationCommandData, callback: ApplicationCommandCallback = noop) {
        if (typeof callback !== 'function') throw new TypeError(`${typeof callback} is not a function`);       

        const posted = await super.create(command);

        if (posted && this.client instanceof Client) this.client.applicationCommands.callbacks.set(posted.id, callback);

        return posted;
    }
}

export class GuildExtension extends Guild {
    public commands: GuildApplicationCommandManager;

    constructor(client: Client, data: object) {
        super(client, data);

        this.commands = new GuildApplicationCommandManager(this);
    }
}

Structures.extend('Guild', BaseGuild => GuildExtension);