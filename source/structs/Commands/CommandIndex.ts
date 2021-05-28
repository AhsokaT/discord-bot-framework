import { PermissionString } from 'discord.js';
import Client from '../../client/Client.js';
import Command, { CommandDetails } from './Command.js';
import helpCommand from '../../util/helpCommand.js';
import { Collection, Index } from '../../util/extensions.js';

export interface CommandIndexOptions {
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionString[];
    automaticMessageParsing?: boolean;
}

export type CommandResolvable = Command | CommandDetails | Command[] | CommandDetails[];

export default class CommandIndex {
    public client: Client;
    public prefix: string;
    public allowBots: boolean;
    public groups: Collection<string>;
    public index: Index<string, Command>;
    public permissions: Collection<PermissionString>;

    constructor(client: Client, options: CommandIndexOptions = {}) {
        this.client = client;

        const { prefix, permissions, allowBots, automaticMessageParsing } = options;

        this.index = new Index();
        this.groups = new Collection();
        this.permissions = new Collection();
        this.allowBots = Boolean(allowBots);
        this.setPrefix(typeof prefix === 'string' ? prefix : '');

        if (Array.isArray(permissions)) this.permissions.array().filter(perm => typeof perm === 'string').forEach(this.permissions.add);

        if (automaticMessageParsing ?? true) this.client.on('message', this.client.parseMessage);
    }

    /**
     * @param prefix A command prefix the bot should discriminate messages with
     * @example
     * setPrefix('$');
     */
    public setPrefix(prefix: string) {
        if (typeof prefix === 'string') this.prefix = prefix;

        return this;
    }

    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     * @example
     * const command = new Command()
     *      .setName('name')
     *      .setDescription('description')
     * 
     * indexCommand(command);
     */
    public indexCommand(command: CommandResolvable): this {
        return this.indexCommands(command);
    }

    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     * @example
     * const ping = new Command()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     * 
     * const purge = new Command()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     * 
     * indexCommands(ping, purge);
     */
    public indexCommands(...commands: CommandResolvable[]): this {
        commands.flat().forEach(command => {
            if (!(command instanceof Command)) return this.indexCommands(new Command(command));

            if (!command.name) throw new Error('A command must have a name set.');

            if (command.group && !this.groups.has(command.group)) throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroups(\'${command.group}\')`);

            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.has(alias)) throw new Error(`Alias \'${alias}\' already exists on command \'${existing.name}\'`);
                });
            });

            this.index.set(command.name, command);
        });

        return this;
    }

    public indexDefaults(): this {
        this.indexCommand(helpCommand);

        return this;
    }

    public indexGroup(name: string): this {
        return this.indexGroups(name);
    }

    public indexGroups(...groups: string[] | string[][]): this {
        const entries = groups.flat().filter(group => typeof group === 'string').map(group => group.toLowerCase());

        entries.forEach(group => this.groups.add(group));

        return this;
    }

    public deleteCommands(...commands: Command[] | string[]): this {
        commands.forEach(command => {
            const toDelete = command instanceof Command ? command : this.index.get(command);

            if (toDelete) this.index.delete(toDelete.name);
        });

        return this;
    }

    public deleteGroup(group: string): this {
        return this.deleteGroups(group);
    }

    public deleteGroups(...groups: string[] | string[][]): this {
        groups.flat().forEach(group => this.groups.delete(group));

        return this;
    }
}