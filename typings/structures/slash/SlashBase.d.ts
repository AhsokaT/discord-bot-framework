import { SlashCommand } from './Slash.js';
import { Client } from '../client/Client.js';
export declare class SlashBase {
    #private;
    constructor(client: Client);
    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    guild(id: string): SlashBase;
    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    global(): SlashBase;
    /**
     * @returns an array of your slash commands.
     */
    all(): Promise<SlashCommand[]>;
    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    post(command: SlashCommand): Promise<SlashCommand | undefined>;
    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    delete(command: string): Promise<SlashCommand | undefined>;
}
