import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { Snowflake } from '../util/types';
import { SlashCommandResolvable, SlashCommandOptions as ApplicationCommandData } from './SlashCommand.js';
import ApplicationCommand from './ApplicationCommand.js';
declare class ApplicationCommandManager {
    client: Client;
    cache: Index<Snowflake, ApplicationCommand>;
    constructor(client: Client);
    post(command: SlashCommandResolvable): Promise<ApplicationCommand | null>;
    edit(command: ApplicationCommand, data: ApplicationCommandData): Promise<ApplicationCommand | null>;
}
export default ApplicationCommandManager;
