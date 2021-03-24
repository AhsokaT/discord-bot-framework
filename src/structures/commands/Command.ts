import { Message, Client, PermissionString } from 'discord.js';

declare type CommandCallback = (message: Message, client: Client, arguments: object) => void;

declare interface ParameterType {
    name: string;
    description?: string;
    type?: 'string' | 'number';
    wordCount?: number | 'unlimited';
    required?: boolean;
    choices?: string[];
}

export interface CommandOptions {
    /**
     * - Name of the command
     */
    name: string;
    /**
     * - The function to be executed when the command is called
     */
    callback: CommandCallback;
    /**
     * - Description of the command
     */
    description?: string;
    /**
     * - Any inputs from the user your function requires to run. Params that are not required will be automatically sorted to the back of the array
     */
    parameters?: ParameterType[];
    /**
     * - Alternate names the command can be called by
     */
    aliases?: string[];
    /**
     * - The category of commands this belongs to
     */
    category?: string;
    /**
     * - The permissions the bot and user require to run this command
     */
    permissions?: PermissionString | PermissionString[];
}

export interface EditOptions extends Omit<CommandOptions, 'name' | 'callback'> {
    name?: string;
    callback?: CommandCallback;
}

export class Command {
    #name: string;
    #aliases: string[];
    #description: string;
    #parameters: ParameterType[];
    #callback: CommandCallback;
    #category: string;
    #permissions: PermissionString[];

    constructor(options: CommandOptions) {
        if (!('name' in options || 'callback' in options)) throw new Error('Argument for \'options\' did not conform to interface \'CommandOptions\'');

        this.#name = options.name;
        this.#aliases = options.aliases ?? [];
        this.#callback = options.callback;
        this.#description = options.description ?? '';
        this.#parameters = options.parameters?.sort((a, b) => a.required && b.required === false ? -1 : 0) ?? [];
        this.#category = options.category ?? '';
        this.#permissions = typeof options.permissions === 'string' ? [options.permissions] : options.permissions ?? [];
    }

    /**
     * Edit the properties of this command
     */
    public edit(options: EditOptions): Command {
        for (const param in options) {
            if (param in this && !param.startsWith('#')) {
                this[param] = options[param];
            }
        }
        return this;
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        if (typeof name === 'string') this.#name = name;
    }

    get aliases() {
        return this.#aliases;
    }

    set aliases(aliases) {
        if (Array.isArray(aliases)) this.#aliases = aliases;
    }

    get category() {
        return this.#category;
    }

    set category(category) {
        this.#category = category;
    }

    set callback(callback) {
        this.#callback = callback;
    }

    get callback() {
        return this.#callback;
    }

    get permissions() {
        return this.#permissions;
    }

    get description() {
        return this.#description;
    }

    set description(description) {
        if (typeof description === 'string') this.#description = description;
    }

    get parameters() {
        return this.#parameters;
    }

    set parameters(parameters) {
        if (!Array.isArray(parameters)) return;

        parameters.filter(i => !('name' in i));

        this.#parameters = parameters;
    }
}