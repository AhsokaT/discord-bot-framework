import { Message, PermissionString } from 'discord.js';
import Client from '../../client/Client.js';
import { Collection, Index } from '../../util/extensions.js';

export type CommandCallback = (this: Command, message: Message, client: Client, args: Index<string, string>) => void;

export interface Parameter {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    caseSensitive?: boolean;
    required?: boolean;
    choices?: string[];
}

export interface CommandDetails {
    name?: string;
    description?: string;
    group?: string;
    nsfw?: boolean;
    aliases?: string[];
    permissions?: PermissionString[];
    parameters?: Parameter[];
    callback?: CommandCallback;
}

export default class Command {
    #name = '';
    #description = '';
    #group = '';
    #nsfw = false;
    #aliases = new Collection<string>();
    #parameters = new Collection<Parameter>();
    #permissions = new Collection<PermissionString>();
    #callback: CommandCallback = (message) => message.channel.send('❌ This command has not yet been programmed').catch(console.error);

    /**
     * @param {CommandDetails} details
     */
    constructor(details?: CommandDetails) {
        if (details) this.edit(details);
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get aliases() {
        return this.#aliases;
    }

    get permissions() {
        return this.#permissions;
    }

    get callback() {
        return this.#callback;
    }

    get group() {
        return this.#group;
    }

    get parameters() {
        return this.#parameters;
    }

    get nsfw() {
        return this.#nsfw;
    }

    /**
     * @param name The name of your command
     */
    public setName(name: string): this {
        if (typeof name === 'string') this.#name = name;

        return this;
    }

    /**
     * @param description A short description of your command
     */
    public setDescription(description: string): this {
        if (typeof description === 'string') this.#description = description;

        return this;
    }

    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    public setNSFW(nsfw = true): this {
        this.#nsfw = Boolean(nsfw);

        return this;
    }

    /**
     * @param group The group of commands this command belongs to
     */
    public setGroup(group: string): this { 
        if (typeof group === 'string') this.#group = group;

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
        if (typeof callback === 'function') this.#callback = callback;

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
    public addParameters(...parameters: Parameter[] | Parameter[][]): this {
        parameters.flat().forEach(parameter => {
            if (typeof parameter !== 'object') throw new TypeError('\'parameter\' must be an object of type \'ParameterType\'.');

            const { name, description, choices, wordCount, type, required, caseSensitive } = parameter;

            if (typeof name !== 'string') throw new TypeError('Property \'name\' of \'parameter\' must be a string.');
            if (description && typeof description !== 'string') throw new TypeError('Property \'description\' of \'parameter\' must be a string.');
            if (wordCount && typeof wordCount !== 'number' && wordCount !== 'unlimited') throw new TypeError('Property \'wordCount\' of \'parameter\' must be a number or \'unlimited\'.');
            if (type && type !== 'number' && type !== 'string') throw new TypeError('Property \'type\' of \'parameter\' must either be \'number\' or \'string\'.');
            if (choices && !Array.isArray(choices)) throw new TypeError('Property \'choices\' of \'parameter\' must be an array.');

            parameter.choices?.filter(choice => typeof choice === 'string');
            parameter.required = typeof required === 'boolean' ? required : true;
            parameter.caseSensitive = typeof caseSensitive === 'boolean' ? caseSensitive : true;

            this.#parameters.add(parameter);
            this.#parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        });

        return this;
    }

    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    public addPermissions(...permissions: PermissionString[]): this {
        permissions.filter(perm => typeof perm === 'string').forEach(this.#permissions.add);

        return this;
    }

    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    public addAliases(...aliases: string[]): this {
        aliases.filter(alias => typeof alias === 'string').forEach(this.#aliases.add);

        return this;
    }

    /**
     * Edit the properties of this command
     * @param details Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    public edit(details: CommandDetails): this {
        const { name, nsfw, description, parameters, permissions, group, aliases, callback } = details;

        if (name) this.setName(name);
        if (group) this.setGroup(group);
        if (callback) this.setCallback(callback);
        if (description) this.setDescription(description);
        if (typeof nsfw === 'boolean') this.setNSFW(nsfw);
        if (Array.isArray(parameters)) this.addParameters(...parameters);
        if (Array.isArray(permissions)) this.addPermissions(...permissions);
        if (Array.isArray(aliases)) this.addAliases(...aliases);

        return this;
    }
}