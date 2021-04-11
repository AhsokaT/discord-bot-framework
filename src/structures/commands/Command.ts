import { Message, PermissionString } from 'discord.js';
import { Arguments } from './CommandManager.js';
import { Client } from '../client/Client.js';

export type CommandCallback = (message: Message, client: Client, args: Arguments) => void;

export interface Parameter {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    caseSensitive?: boolean;
    required?: boolean;
    choices?: string[];
}

export interface Argument {
    name: string;
    value: string;
}

export interface CommandInfo {
    /**
     * The name of your command
     */
    name?: string;
    /**
     * The function to be executed when this command is invoked
     */
    callback?: CommandCallback;
    /**
     * A short description of your command
     */
    description?: string;
    /**
     * Whether the command should only be usable in NSFW channels; false by default
     */
    nsfw?: boolean;
    /**
     * Parameter(s) this command accepts
     */
    parameters?: Parameter[];
    /**
     * Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * The category of commands this command belongs to
     */
    category?: string;
    /**
     * Permission(s) this command requires to run
     */
    permissions?: PermissionString[];
}

export class Command {
    #name?: string;
    #description?: string;
    #category?: string;
    #nsfw: boolean = false;
    #aliases: string[] = [];
    #parameters: Parameter[] = [];
    #permissions: PermissionString[] = [];
    #callback?: CommandCallback;

    constructor(info?: CommandInfo) {
        if (info) this.edit(info);
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get parameters() {
        return this.#parameters;
    }

    get nsfw() {
        return this.#nsfw;
    }

    get category() {
        return this.#category;
    }

    get permissions() {
        return this.#permissions;
    }

    get aliases() {
        return this.#aliases;
    }

    get callback() {
        return this.#callback;
    }

    /**
     * @param name The name of your command
     */
    public setName(name: string): this {
        if (name && typeof name === 'string') this.#name = name;
        return this;
    }

    /**
     * @param description A short description of your command
     */
    public setDescription(description: string): this {
        if (description && typeof description === 'string') this.#description = description;
        return this;
    }

    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    public setNSFW(nsfw: boolean = true): this {
        this.#nsfw = Boolean(nsfw);
        return this;
    }

    /**
     * @param category The category of commands this command belongs to
     */
    public setCategory(category: string): this {
        if (category && typeof category === 'string') this.#category = category.toLowerCase();
        return this;
    }

    /**
     * @param callback The function to be executed when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     */
    public setCallback(callback: CommandCallback): this {
        if (typeof callback === 'function') this.#callback = callback;        

        return this;
    }

    /**
     * @param name 
     * @param description 
     * @param type 
     * @param wordCount 
     * @param required 
     * @param choices 
     * @example
     * addParameter('id', 'The ID of a member');
     */
    public addParameter(name: string, description?: string, type?: 'string' | 'number', wordCount?: number | 'unlimited', required?: boolean, choices?: string[]): this {
        this.addParameters({
            name,
            description,
            type,
            wordCount,
            required,
            choices
        });

        return this;
    }

    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters({ name: 'id', description: 'The ID of a member' }, { name: 'role', description: 'The ID of a role' });
     */
    public addParameters(...parameters: Parameter[]): this {
        if (Array.isArray(parameters)) parameters.forEach(parameter => {
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

            this.#parameters.push(parameter);
            this.#parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        });

        return this;
    }

    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    public addPermissions(...permissions: PermissionString[]): this {
        if (Array.isArray(permissions)) this.#permissions.push(...permissions.filter(perm => typeof perm === 'string'));

        return this;
    }

    /**
     * @param alias Alternative name(s) this command can be called by
     * @example
     * addAlias('purge', 'bulkdelete');
     */
    public addAlias(...alias: string[]): this {
        if (Array.isArray(alias)) this.#aliases.push(...alias.filter(alias => typeof alias === 'string'));

        return this;
    }

    /**
     * Edit the properties of this command
     * @param info Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    public edit(info: CommandInfo): this {
        if (typeof info !== 'object') throw new TypeError('Parameter for \'info\' must be of type \'CommandInfo\'.');

        const { name, description, category, callback, permissions, parameters, nsfw, aliases } = info;

        if (name) this.setName(name);
        if (description) this.setDescription(description);
        if (category) this.setCategory(category);
        if (callback) this.setCallback(callback);
        if (typeof nsfw === 'boolean') this.setNSFW(nsfw);
        if (Array.isArray(permissions)) this.addPermissions(...permissions);
        if (Array.isArray(parameters)) this.addParameters(...parameters);
        if (Array.isArray(aliases)) this.addAlias(...aliases);

        return this;
    }
}