import { Message } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import DMCommand from './DMCommand.js';
import GuildCommand from './GuildCommand.js';

type CommandCallback = (this: Command, message: Message, client: Client, args: Index<string, string>) => void;

interface CommandParameter {
    name: string;
    description?: string;
    type?: 'string' | 'number' | 'boolean' | 'user' | 'channel' | 'role' | 'mentionable';
    wordCount?: number | 'unlimited';
    caseSensitive?: boolean;
    required?: boolean;
    choices?: string[];
}

interface CommandProperties {
    name: string;
    nsfw: boolean;
    group: string;
    description: string;
    parameters: Iterable<CommandParameter>;
    aliases: Iterable<string>;
    callback: CommandCallback;
}

function isCommandParameter(obj: any): obj is CommandParameter {
    return 'name' in obj;
}

class Command implements CommandProperties {
    public name: string;
    public description: string;
    public group: string;
    public nsfw: boolean;
    public aliases: Collection<string>;
    public parameters: Collection<CommandParameter>;
    public callback: CommandCallback;

    constructor(properties?: Partial<CommandProperties>) {
        this.aliases = new Collection();
        this.parameters = new Collection();
        this.callback = (message) => message.channel.send('❌ This command has not yet been programmed').catch(console.error);

        if (properties)
            this.edit(properties);
    }

    public isGuildCommand(): this is GuildCommand {
        return 'permissions' in this;
    }

    public isDMCommand(): this is DMCommand {
        return this.constructor.name === 'DMCommand';
    }

    // public isUniversalCommand(): this is Command {
    //     return this.constructor.name === 'Command';
    // }

    /**
     * @param name The name of your command
     */
    public setName(name: string): this {
        if (typeof name !== 'string')
            throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);

        this.name = name;

        return this;
    }

    /**
     * @param description A short description of your command
     */
    public setDescription(description: string): this {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);

        this.description = description;

        return this;
    }

    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    public setNSFW(nsfw = true): this {
        if (typeof nsfw !== 'boolean')
            throw new TypeError(`Type '${typeof nsfw}' is not assignable to type 'boolean'.`);

        this.nsfw = Boolean(nsfw);

        return this;
    }

    /**
     * @param group The group of commands this command belongs to
     */
    public setGroup(group: string): this { 
        if (typeof group !== 'string')
            throw new TypeError(`Type '${typeof group}' is not assignable to type 'string'.`);

        this.group = group;

        return this;
    }

    /**
     * @param callback The function to be called when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     * 
     * setCallback(function(message, client, args) {
     *      message.channel.send(this.name, this.description);
     * });
     */
    public setCallback(callback: CommandCallback): this {
        if (typeof callback !== 'function')
            throw new TypeError(`Type '${typeof callback}' is not assignable to type 'function'.`);

        this.callback = callback;

        return this;
    }

    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters(
     *    { name: 'id', description: 'The ID of a member', wordCount: 1 },
     *    { name: 'role', description: 'The ID of a role', required: false }
     * );
     */
    public addParameters(...parameters: CommandParameter[] | CommandParameter[][]): this {
        parameters.flat().forEach(parameter => {
            if (!isCommandParameter(parameter))
                throw new TypeError('Command parameters must conform to type \'CommandParameter\'');

            const { name, description, choices, wordCount, type, required, caseSensitive } = parameter;

            if (typeof name !== 'string')
                throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);

            if (description && typeof description !== 'string')
                throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);

            if (wordCount && typeof wordCount !== 'number' && wordCount !== 'unlimited')
                throw new TypeError(`Type '${typeof wordCount}' is not assignable to type 'number'.`);

            if (type && type !== 'number' && type !== 'string')
                throw new TypeError(`Type '${typeof type}' is not assignable to type 'string | number'.`);

            if (choices && !Array.isArray(choices))
                throw new TypeError(`Type '${typeof choices}' is not assignable to type 'array'.`);

            parameter.choices?.filter(choice => typeof choice === 'string');
            parameter.required = typeof required === 'boolean' ? required : true;
            parameter.caseSensitive = typeof caseSensitive === 'boolean' ? caseSensitive : true;

            this.parameters.add(parameter);
            this.parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        });

        return this;
    }

    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    public addAliases(...aliases: string[]): this {
        aliases.filter(alias => typeof alias === 'string').forEach(alias => this.aliases.add(alias));

        return this;
    }

    /**
     * Edit the properties of this command
     * @param properties Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Delete messages' });
     */
    public edit(properties: Partial<CommandProperties>): this {
        if (typeof properties !== 'object')
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'object'.`);

        const { name, nsfw, description, parameters, group, aliases, callback } = properties;

        if (name)
            this.setName(name);

        if (group)
            this.setGroup(group);

        if (callback)
            this.setCallback(callback);

        if (description)
            this.setDescription(description);

        if (typeof nsfw === 'boolean')
            this.setNSFW(nsfw);

        if (Array.isArray(parameters))
            this.addParameters(...parameters);

        if (Array.isArray(aliases))
            this.addAliases(...aliases);

        return this;
    }
}

export {
    CommandProperties,
    CommandParameter,
    CommandCallback
}

export default Command;