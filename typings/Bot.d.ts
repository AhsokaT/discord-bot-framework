import { Base, BaseOptions } from './Base.js';
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
export declare class DiscordBot extends Base {
    #private;
    constructor(options: DiscordBotOptions);
    set allowBots(allowBots: boolean);
    get allowBots(): boolean;
}
