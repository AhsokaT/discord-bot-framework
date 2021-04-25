import { PermissionString } from 'discord.js';
import Client from '../../client/Client.js';
import Command, { CommandDetails } from './Command.js';
import helpCommand from '../../util/helpCommand.js';
import { Group, Index } from '../../util/extensions.js';

export interface CommandIndexOptions {
    groups?: string[];
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionString[];
    automaticMessageParsing?: boolean;
}

export type CommandResolvable = Command | CommandDetails;

export default class CommandIndex {
    public client: Client;
    public prefix: string;
    public allowBots: boolean;
    public groups: Group<string>;
    public index: Index<string, Command>;
    public permissions: PermissionString[];

    constructor(client: Client, options: CommandIndexOptions = {}) {
        this.client = client;

        const { prefix, permissions, groups, allowBots, automaticMessageParsing } = options;

        this.index = new Index();
        this.allowBots = Boolean(allowBots);
        this.groups = Array.isArray(groups) ? new Group(groups) : new Group();
        this.permissions = Array.isArray(permissions) ? permissions : [];
        this.prefix = typeof prefix === 'string' ? prefix : '';

        if (automaticMessageParsing ?? true) this.client.on('message', this.client.parseMessage);
    }

    /**
     * @param prefix A command prefix the bot should look for
     */
    public setPrefix(prefix: string) {
        if (typeof prefix === 'string') this.prefix = prefix;

        return this;
    }

    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     */
    public indexCommand(command: CommandResolvable): this {
        return this.indexCommands(command);
    }

    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     */
    public indexCommands(...commands: CommandResolvable[]): this {
        commands.forEach(command => {
            if (!(command instanceof Command)) return this.indexCommands(new Command(command));

            if (!command.name) throw new Error('A command must have a name set.');
            if (!command.callback) throw new Error('A commands must have a callback set.');

            if (command.group && !this.groups.has(command.group)) throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroup(\'${command.group}\')`);

            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.includes(alias)) throw new Error(`Alias \'${alias}\' already exists on command \'${existing.name}\'`);
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

    public indexGroup(group: string): this {
        return this.indexGroups(group);
    }

    public indexGroups(...groups: string[]): this {
        groups.forEach(group => {
            if (typeof group === 'string') this.groups.add(group);
        });

        return this;
    }

    public removeCommands(...commands: (Command | string)[]): this {
        commands.forEach(command => this.index.delete(command instanceof Command ? command.name : command));

        return this;
    }

    public removeGroup(group: string): this {
        return this.removeGroups(group);
    }

    public removeGroups(...groups: string[]): this {
        groups.forEach(group => this.groups.delete(group));

        return this;
    }
}