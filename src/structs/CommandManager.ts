import { PermissionResolvable } from 'discord.js';
import Client from '../client/Client.js';
import helpCommand from '../util/helpCommand.js';
import { Collection, Index } from 'js-augmentations';
import GuildCommand, { GuildCommandProperties } from './commands/GuildCommand.js';
import DMCommand, { DMCommandProperties } from './commands/DMCommand.js';
import Command, { CommandProperties } from './commands/Command.js';
import { isIterable } from '../util/util.js';

interface CommandManagerOptions {
    prefix?: string;
    allowBots?: boolean;
    permissions?: PermissionResolvable[];
    automaticMessageParsing?: boolean;
    promptUserForInput?: boolean;
}

type Resolvable<T> = T | Iterable<T>;

type CommandResolvable =
    | Resolvable<Command>
    | Resolvable<DMCommand>
    | Resolvable<GuildCommand>
    | Resolvable<CommandProperties | DMCommandProperties | GuildCommandProperties>;

function isDMCommandProperties(obj: any): obj is DMCommandProperties {
    return obj.type === 'DM';
}

function isGuildCommandProperties(obj: any): obj is GuildCommandProperties {
    return obj.type === 'Guild';
}

function isUniversalCommandProperties(obj: any): obj is CommandProperties {
    return obj.type === 'Universal';
}

class CommandManager {
    public prefix: string;
    public allowBots: boolean;
    public groups: Collection<string>;
    public index: Index<string, GuildCommand | DMCommand | Command>;
    public permissions: Collection<PermissionResolvable>;
    public promptUserForInput: boolean;

    constructor(public client: Client, options: CommandManagerOptions = {}) {
        this.client = client;

        const { prefix, permissions, allowBots, automaticMessageParsing, promptUserForInput } = options;

        this.index = new Index();
        this.groups = new Collection();
        this.permissions = new Collection();
        this.allowBots = Boolean(allowBots);
        this.promptUserForInput = typeof promptUserForInput === 'boolean' ? promptUserForInput : true;
        this.setPrefix(typeof prefix === 'string' ? prefix : '');

        if (Array.isArray(permissions))
            this.permissions.push(...permissions);

        if (automaticMessageParsing ?? true)
            this.client.on('message', this.client.parseMessage);
    }

    *[Symbol.iterator]() {
        yield* this.index.array();
    }

    /**
     * @param prefix A command prefix the bot should discriminate messages with
     * @example
     * setPrefix('$');
     */
    public setPrefix(prefix: string) {
        if (typeof prefix === 'string')
            this.prefix = prefix;

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
     * const ping = new UniversalCommand()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     * 
     * const purge = new GuildCommand()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     * 
     * indexCommands(ping, purge);
     */
    public indexCommands(...commands: CommandResolvable[]): this {
        commands.map(item => isIterable(item) ? [ ...item ] : item).flat().forEach(command => {
            if (!(command instanceof Command)) {
                if (!['DM', 'Guild', 'Universal'].includes(command.type))
                    throw new TypeError(`CommandDetails must contain a type, either 'DM', 'Guild', or 'Universal'.`);

                if (isDMCommandProperties(command))
                    return this.indexCommands(new DMCommand(command));

                if (isGuildCommandProperties(command))
                    return this.indexCommands(new GuildCommand(command));

                if (isUniversalCommandProperties(command))
                    return this.indexCommands(new Command(command));
            }

            if (!command.name)
                throw new Error('A command must have a name set.');

            if (command.group && !this.groups.has(command.group))
                throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroups(\'${command.group}\')`);

            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.has(alias))
                        throw new Error(`Alias \'${alias}\' already exists on command \'${existing.name}\'`);
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

    public indexGroups(...groups: Resolvable<string>[]): this {
        const entries = groups.flat().map(item => typeof item !== 'string' && isIterable(item) ? [ ...item ] : item).flat().filter(group => typeof group === 'string');

        entries.forEach(group => this.groups.add(group));

        return this;
    }

    public deleteCommands(...commands: CommandResolvable[] | Resolvable<string>[]): this {
        commands.flat().map(item => typeof item !== 'string' && isIterable(item) ? [ ...item ] : item).flat().forEach(command => {
            let toDelete: Command | undefined;

            if (command instanceof Command)
                toDelete = command;
            else
                toDelete = this.index.get(typeof command === 'string' ? command : command.name);

            if (toDelete)
                this.index.delete(toDelete.name);
        });

        return this;
    }

    public deleteGroup(group: string): this {
        return this.deleteGroups(group);
    }

    public deleteGroups(...groups: Resolvable<string>[]): this {
        groups.flat().map(item => typeof item !== 'string' && isIterable(item) ? [ ...item ] : item).flat().forEach(group => this.groups.delete(group));

        return this;
    }
}

export {
    CommandManagerOptions,
    CommandResolvable,
    CommandManager
}

export default CommandManager;