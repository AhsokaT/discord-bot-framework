import { Base, BaseOptions } from './Base.js';
import { CommandManager } from './CommandManager.js';
import { PermissionString } from 'discord.js';

export interface DiscordBotOptions extends BaseOptions {
    /**
     * - Whether your bot should read messages from other bots; false by default
     */
    allowBots?: boolean;
    /**
     * - The permissions to ask for when the bot is invited
     */
    permissions?: PermissionString | PermissionString[];
    /**
     * - A command prefix the bot should look for
     */
    prefix?: string;
}

export class DiscordBot extends Base {
    #allowBots: boolean;
    #permissions: PermissionString | PermissionString[];
    #prefix: string;
    #commands: CommandManager;

    constructor(options: DiscordBotOptions) {
        super({ ...options });

        this.#prefix = options.prefix ?? '';
        this.#allowBots = options.allowBots ?? false;
        this.#permissions = options.permissions ?? [];
        this.#commands = new CommandManager();
    }

    set allowBots(allowBots: boolean) {
        this.#allowBots = allowBots;
    }

    get allowBots() {
        return this.#allowBots;
    }
}