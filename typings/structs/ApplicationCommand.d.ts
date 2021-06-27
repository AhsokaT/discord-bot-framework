import { ApplicationCommand as DJSApplicationCommand, Guild } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { Snowflake } from '../util/types';
import { SlashCommandCallback } from './SlashCommand.js';
import ApplicationCommandOption from './SlashCommandOption.js';
declare class ApplicationCommand {
    client: Client;
    id: Snowflake;
    name: string;
    description: string;
    defaultPermission: boolean;
    options: Collection<ApplicationCommandOption>;
    callback: SlashCommandCallback;
    guild: Guild | null;
    constructor(client: Client, command: DJSApplicationCommand, callback: SlashCommandCallback);
    get createdAt(): Date;
    fetch(): Promise<ApplicationCommand | null>;
    delete(): Promise<ApplicationCommand | null>;
}
export default ApplicationCommand;
