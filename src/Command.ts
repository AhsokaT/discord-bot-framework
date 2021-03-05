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

export interface EditCommand extends Omit<CommandOptions, 'name' | 'callback'> {
    name?: string;
    callback?: string;
}

function isCommandOptions(object: any): object is CommandOptions {
    return 'name' in object && 'callback' in object;
}

export class Command {
    #name: string;
    #description: string;
    #parameters: ParameterType[];
    #callback: CommandCallback;
    #category: string;
    #permissions: PermissionString | PermissionString[];

    constructor(options: CommandOptions) {
        if (!isCommandOptions(options)) throw new Error('Argument for \'options\' did not conform to interface \'CommandOptions\'');

        this.#name = options.name;
        this.#callback = options.callback;
        this.#description = options.description ?? '';
        this.#parameters = options.parameters?.sort((a, b) => a.required && b.required === false ? -1 : 0) ?? [];
        this.#category = options.category ?? '';
        this.#permissions = options.permissions ?? [];
    }

    public edit(options?: EditCommand) {
        for (const param in options) {
            if (param in this) this[param] = options[param];
        }
    }

    get name() {
        return this.#name;
    }

    set name(name) {
        if (typeof name !== 'string') return;
        this.#name = name;
    }

    get description() {
        return this.#description;
    }

    set description(description) {
        if (typeof description !== 'string') return;
        this.#description = description;
    }
}