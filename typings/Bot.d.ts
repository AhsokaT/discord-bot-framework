import { Base, BaseOptions } from './Base.js';
import { CommandManager, CommandManagerOptions } from './CommandManager.js';
import { PermissionString } from 'discord.js';
import { Command, CommandOptions } from './Command.js';
export interface DiscordBotOptions extends BaseOptions, CommandManagerOptions {
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
export declare class DiscordBot extends Base {
    #private;
    constructor(options: DiscordBotOptions);
    get commands(): CommandManager;
    /**
     * @deprecated since version 1.2.0, use .commands.add();
     */
    addCommand(command: Command | CommandOptions): void;
    /**
     * @deprecated since version 1.2.0, use .commands.remove();
     */
    removeCommand(command: Command | string): void;
}
