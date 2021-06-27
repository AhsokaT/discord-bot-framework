import { GuildResolvable } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import { APISlashCommandResolvable, APISlashCommandOptions } from './APISlashCommand.js';
import ApplicationCommand, { ApplicationCommandResolvable } from './ApplicationCommand.js';
declare class ApplicationCommandManager {
    client: Client;
    cache: Index<Snowflake, ApplicationCommand>;
    constructor(client: Client);
    post(command: APISlashCommandResolvable): Promise<ApplicationCommand | null>;
    edit(command: ApplicationCommand, data: APISlashCommandOptions): Promise<ApplicationCommand | null>;
    delete(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | null>;
    fetch(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | null>;
}
export default ApplicationCommandManager;
