import { GuildResolvable } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import { SlashCommandResolvable, SlashCommandOptions } from './SlashCommand.js';
import DiscordSlashCommand, { DiscordSlashCommandResolvable } from './DiscordSlashCommand.js';
declare class SlashCommandManager {
    client: Client;
    cache: Index<Snowflake, DiscordSlashCommand>;
    constructor(client: Client);
    create(command: SlashCommandResolvable): Promise<DiscordSlashCommand>;
    edit(command: DiscordSlashCommandResolvable, data: Partial<SlashCommandOptions>): Promise<DiscordSlashCommand>;
    delete(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand | null>;
    fetch(): Promise<Index<Snowflake, DiscordSlashCommand>>;
    fetch(command: null, guild: GuildResolvable): Promise<Index<Snowflake, DiscordSlashCommand>>;
    fetch(command: DiscordSlashCommandResolvable, guild?: GuildResolvable): Promise<DiscordSlashCommand>;
}
export default SlashCommandManager;
