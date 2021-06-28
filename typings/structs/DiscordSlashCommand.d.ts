import { Guild, ApplicationCommand } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { SlashCommandCallback, SlashCommandOptions } from './SlashCommand.js';
import SlashCommandOption from './SlashCommandOption.js';
interface DiscordSlashCommandData extends Omit<ApplicationCommand, 'delete' | 'edit' | 'fetch' | 'fetchPermissions' | 'toJSON' | 'valueOf' | 'setPermissions'> {
    callback?: SlashCommandCallback;
    deleted?: boolean;
}
declare type DiscordSlashCommandResolvable = DiscordSlashCommand | Snowflake;
declare class DiscordSlashCommand {
    client: Client;
    id: Snowflake;
    name: string;
    description: string;
    defaultPermission: boolean;
    options: Collection<SlashCommandOption>;
    callback: SlashCommandCallback;
    guild: Guild | null;
    deleted: boolean;
    constructor(client: Client, data: DiscordSlashCommandData);
    get createdAt(): Date;
    fetch(): Promise<DiscordSlashCommand | null>;
    delete(): Promise<DiscordSlashCommand | null>;
    edit(data: SlashCommandOptions): Promise<DiscordSlashCommand>;
}
export { DiscordSlashCommandResolvable };
export default DiscordSlashCommand;
