import { CommandInteraction, ApplicationCommandData as APISlashCommandData, GuildResolvable } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import ApplicationCommand from './DiscordSlashCommand.js';
import SlashCommandOption, { SlashCommandOptionResolvable } from './SlashCommandOption.js';
declare type SlashCommandCallback = (interaction: CommandInteraction, command: ApplicationCommand, client: Client) => void;
interface SlashCommandOptions {
    name: string;
    description: string;
    guild?: GuildResolvable | null;
    options?: Iterable<SlashCommandOptionResolvable>;
    defaultPermission?: boolean;
    callback?: SlashCommandCallback;
}
declare type SlashCommandResolvable = SlashCommand | SlashCommandOptions;
declare class SlashCommand implements Required<SlashCommandOptions> {
    name: string;
    description: string;
    guild: GuildResolvable | null;
    options: Collection<SlashCommandOption>;
    defaultPermission: boolean;
    callback: SlashCommandCallback;
    constructor(options?: Partial<SlashCommandOptions>);
    edit(options: Partial<SlashCommandOptions>): this;
    setCallback(callback: SlashCommandCallback): this;
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
export { SlashCommandOptions, SlashCommandCallback, SlashCommandResolvable };
export default SlashCommand;
