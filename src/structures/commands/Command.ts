import { Message, Client, PermissionString } from 'discord.js';

declare type CommandCallback = (message: Message, client: Client, arguments: Argument[]) => void;

declare interface Parameter {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    required?: boolean;
    choices?: string[];
}

export interface Argument {
    name: string;
    value: string;
}

export interface CommandInfo {
    /**
     * - The name of your command
     */
    name?: string;
    /**
     * - The function to be executed when the command is called
     */
    callback?: CommandCallback;
    /**
     * - A short description of your command
     */
    description?: string;
    /**
     * Whether the command should only be usable in NSFW channels; false by default
     */
    nsfw?: boolean;
    /**
     * - Any inputs from the user your function requires to run. Params that are not required will be automatically sorted to the back of the array
     */
    parameters?: Parameter[];
    /**
     * - Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * - The category of commands your command belongs to
     */
    category?: string;
    /**
     * - The permissions the bot and user require to run this command
     */
    permissions?: PermissionString | PermissionString[];
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

    public toObject() {
        return {
            name: this.name,
            description: this.description,
            nsfw: this.nsfw,
            category: this.category,
            aliases: this.aliases,
            parameters: this.parameters,
            permissions: this.permissions,
            callback: this.callback,
        }
    }

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
     * @param nsfw Whether the command should only be usable in NSFW channels; false by default
     */
    public setNSFW(nsfw: boolean): this {
        this.#nsfw = Boolean(nsfw);
        return this;
    }

    /**
     * @param category The category of commands this command belongs to
     */
    public setCategory(category: string): this {
        if (category && typeof category === 'string') this.#category = category;
        return this;
    }

    public setCallback(callback: CommandCallback): this {
        if (typeof callback === 'function') this.#callback = callback;        

        return this;
    }

    /**
     * @param parameter Parameter(s) this command accepts
     */
    public addParameter(parameter: Parameter | Parameter[]): this {
        if (!parameter) return this;

        if (Array.isArray(parameter)) {
            parameter.forEach(param => this.addParameter(param));

            return this;
        }

        if (typeof parameter !== 'object') throw new TypeError('\'parameter\' must be an object of type \'ParameterType\'.');

        const { name, description, choices, wordCount, type, required } = parameter;

        if (typeof name !== 'string') throw new TypeError('Property \'name\' of \'parameter\' must be a string.');
        if (description && typeof description !== 'string') throw new TypeError('Property \'description\' of \'parameter\' must be a string.');
        if (wordCount && typeof wordCount !== 'number' && wordCount !== 'unlimited') throw new TypeError('Property \'wordCount\' of \'parameter\' must be a number or \'unlimited\'.');
        if (type && type !== 'number' && type !== 'string') throw new TypeError('Property \'type\' of \'parameter\' must either be \'number\' or \'string\'.');
        if (choices && !Array.isArray(choices)) throw new TypeError('Property \'choices\' of \'parameter\' must be an array.');

        parameter.choices?.filter(choice => typeof choice === 'string');
        parameter.required = typeof required === 'boolean' ? required : true;

        this.#parameters.push(parameter);
        this.#parameters.sort((a, b) => a.required && !b.required ? -1 : 0);

        return this;
    }

    /**
     * @param permission Permission(s) this command requires to run
     */
    public addPermission(permission: PermissionString | PermissionString[]): this {
        if (Array.isArray(permission)) {
            permission.forEach(perm => this.addPermission(perm));

            return this;
        }

        if (typeof permission !== 'string') return this;

        this.#permissions.push(permission);

        return this;
    }

    /**
     * @param alias Alternative name(s) this command can be called by
     */
    public addAlias(alias: string | string[]): this {
        if (Array.isArray(alias)) {
            alias.forEach(i => this.addAlias(i));

            return this;
        }

        if (typeof alias !== 'string') return this;

        this.#aliases.push(alias);

        return this;
    }

    /**
     * Edit the properties of this command
     */
    public edit(info: CommandInfo): this {
        if (typeof info !== 'object') throw new TypeError('Parameter for \'info\' must be of type \'CommandInfo\'.');

        const { name, description, category, callback, permissions, parameters, nsfw, aliases } = info;

        if (name) this.setName(name);
        if (description) this.setDescription(description);
        if (category) this.setCategory(category);
        if (callback) this.setCallback(callback);
        if (typeof nsfw === 'boolean') this.setNSFW(nsfw);
        if (Array.isArray(permissions)) this.addPermission(permissions);
        if (Array.isArray(parameters)) this.addParameter(parameters);
        if (Array.isArray(aliases)) this.addAlias(aliases);

        return this;
    }
}