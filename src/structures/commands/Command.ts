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
    name?: string;
    /**
     * - The function to be executed when the command is called
     */
    callback?: CommandCallback;
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
    #description: string = '';
    #callback: CommandCallback;
    #category?: string;
    #aliases: string[] = [];
    #parameters: ParameterType[] = [];
    #permissions: PermissionString[] = [];

    constructor(options?: CommandOptions) {
        if (!options) return;

        const { name, description, category, permissions, parameters, aliases, callback } = options;

        if (callback) this.callback = callback;
        if (typeof name === 'string') this.name = name;
        if (typeof category === 'string') this.category = category;
        if (typeof description === 'string') this.description = description;
        if (Array.isArray(aliases)) this.aliases = aliases;
        if (Array.isArray(permissions)) this.#permissions = permissions;
        if (Array.isArray(parameters)) this.parameters = parameters.map(i => {
            if (typeof i.required !== 'boolean') i.required = true;

            return i;
        }).sort((a, b) => a.required && b.required === false ? -1 : 0);
    }

    /**
     * Edit the properties of this command
     */
    public edit(options: EditOptions): Command {
        for (const param in options) {
            if (param in this && !param.startsWith('#')) this[param] = options[param];
        }

        return this;
    }

    // public isComplete(): this is Required<Command> {
    //     return true;
    // }

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

    set permissions(permissions) {
        if (Array.isArray(permissions)) this.#permissions = permissions;
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