import { CommandInteraction, ApplicationCommandData as SlashCommandData, GuildResolvable } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import DiscordSlashCommand from './DiscordSlashCommand.js';
import SlashCommandParameter, { SlashCommandParameterResolvable } from './SlashCommandParameter.js';
declare type SlashCommandCallback = (this: SlashCommand, interaction: CommandInteraction, command: DiscordSlashCommand, client: Client) => void;
interface SlashCommandOptions {
    name: string;
    description: string;
    guild?: GuildResolvable | null;
    parameters?: Iterable<SlashCommandParameterResolvable>;
    defaultPermission?: boolean;
    callback?: SlashCommandCallback;
}
declare type SlashCommandResolvable = SlashCommand | SlashCommandOptions;
declare class SlashCommand implements Required<SlashCommandOptions> {
    name: string;
    description: string;
    guild: GuildResolvable | null;
    defaultPermission: boolean;
    callback: SlashCommandCallback;
    parameters: Collection<SlashCommandParameter>;
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
    addParameters(...parameters: SlashCommandParameterResolvable[]): this;
    get data(): SlashCommandData;
}
export { SlashCommandOptions, SlashCommandCallback, SlashCommandResolvable };
export default SlashCommand;
