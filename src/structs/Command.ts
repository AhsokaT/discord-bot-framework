import { Message, PermissionResolvable } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../client/Client.js';
import { isIterable } from '../util/util.js';
import Argument from './Argument.js';
import { Parameter, ParameterResolvable } from './Parameter.js';

type CommandCallback = (this: Command, message: Message, args: Index<string, Argument>, client: Client) => void;

type CommandType =
    | 'DM'
    | 'Guild'
    | 'Universal';

interface CommandOptions {
    name?: string;
    nsfw?: boolean;
    group?: string;
    description?: string;
    callback?: CommandCallback;
    parameters?: Iterable<Parameter>;
    aliases?: Iterable<string>;
    permissions?: Iterable<PermissionResolvable>;
    type?: CommandType;
}

class Command implements Required<CommandOptions> {
    public name: string;
    public description: string;
    public group: string;
    public nsfw: boolean;
    public aliases: Collection<string>;
    public parameters: Collection<Parameter>;
    public callback: CommandCallback;
    public permissions: Collection<PermissionResolvable>;
    public type: CommandType;

    constructor(properties?: CommandOptions) {
        this.aliases = new Collection();
        this.parameters = new Collection();
        this.permissions = new Collection();
        this.setType('Universal');
        this.setCallback((message) => message.channel.send('🛠️ This command is **under construction** 🏗️').catch(console.error));

        if (properties)
            this.edit(properties);
    }

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

        this.nsfw = nsfw;

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
     * The type property of a command determines where the command can be called,
     * either in a DM channel, Guild channel or both
     * @param type
     */
    public setType(type: CommandType): this {
        if (type !== 'DM' && type !== 'Guild' && type !== 'Universal')
            throw new TypeError(`Value '${type}' is not assignable to type 'CommandType'.`);

        this.type = type;

        return this;
    }

    /**
     * @param callback The function to be called when this command is invoked
     * @example
     * setCallback((message, args, client) => message.reply('pong!'));
     * 
     * setCallback(function(message, args, client) {
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
    public addParameters(...parameters: ParameterResolvable[]): this {
        parameters.map(param => isIterable(param) ? [...param] : param).flat().forEach(parameter => {
            if (!(parameter instanceof Parameter))
                return this.addParameters(new Parameter(parameter));

            const { required, caseSensitive, key } = parameter;

            if (!key)
                throw new Error('Command parameters must have a key set.');

            parameter.choices.filter(choice => typeof choice === 'string');
            parameter.required = typeof required === 'boolean' ? required : true;
            parameter.caseSensitive = typeof caseSensitive === 'boolean' ? caseSensitive : true;

            this.parameters.add(parameter);
        });

        this.parameters.sort((a, b) => a.required && !b.required ? -1 : 0);

        return this;
    }

    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions: PermissionResolvable[]): this {
        permissions.forEach(permission => this.permissions.add(permission));

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
    public edit(properties: CommandOptions): this {
        if (typeof properties !== 'object')
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'CommandOptions'.`);

        const { name, nsfw, description, parameters, group, aliases, callback, type } = properties;

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

        if (type)
            this.setType(type);

        if (parameters && isIterable(parameters))
            this.addParameters(parameters);

        if (aliases && isIterable(aliases))
            this.addAliases(...aliases);

        return this;
    }
}

export {
    Command,
    CommandOptions,
    CommandCallback,
    CommandType
}

export default Command;