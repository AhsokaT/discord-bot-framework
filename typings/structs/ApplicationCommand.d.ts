import { Guild } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { APISlashCommandCallback } from './APISlashCommand.js';
import ApplicationCommandOption from './SlashCommandOption.js';
declare type SlashCommandResolvable = SlashCommand | Snowflake;
declare class SlashCommand {
    client: Client;
    id: Snowflake;
    name: string;
    description: string;
    defaultPermission: boolean;
    options: Collection<ApplicationCommandOption>;
    callback: APISlashCommandCallback | null;
    guild: Guild | null;
    deleted: boolean;
    constructor(client: Client, command: any, callback?: APISlashCommandCallback | null);
    get createdAt(): Date;
    fetch(): Promise<SlashCommand | null>;
    delete(): Promise<SlashCommand | null>;
}
export { SlashCommandResolvable };
export default SlashCommand;
