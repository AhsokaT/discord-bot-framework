import { CommandInteraction, ApplicationCommandData as APISlashCommandData, GuildResolvable } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import ApplicationCommand from './ApplicationCommand.js';
import SlashCommandOption, { SlashCommandOptionResolvable } from './SlashCommandOption.js';
declare type APISlashCommandCallback = (interaction: CommandInteraction, command: ApplicationCommand, client: Client) => void;
interface APISlashCommandOptions {
    name: string;
    description: string;
    guild?: GuildResolvable | null;
    options?: Collection<SlashCommandOption>;
    defaultPermission?: boolean;
    callback?: APISlashCommandCallback;
}
declare type APISlashCommandResolvable = APISlashCommand | APISlashCommandOptions;
declare class APISlashCommand {
    name: string;
    description: string;
    guild: GuildResolvable | null;
    options: Collection<SlashCommandOption>;
    defaultPermission: boolean;
    callback: APISlashCommandCallback;
    constructor(options?: Partial<APISlashCommandOptions>);
    edit(options: Partial<APISlashCommandOptions>): this;
    setCallback(callback: APISlashCommandCallback): this;
    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    setName(name: string): this;
    /**
     * @param description 1-100 character description
     */
    setDescription(description: string): this;
    /**
     * @param defaultPermission whether the command is enabled by default when the app is added to a guild
     */
    setDefaultPermission(defaultPermission: boolean): this;
    setGuild(guild: GuildResolvable): this;
    addOptions(...options: SlashCommandOptionResolvable[]): this;
    toAPIObject(): APISlashCommandData;
}
export { APISlashCommandOptions, APISlashCommandCallback, APISlashCommandResolvable };
export default APISlashCommand;
