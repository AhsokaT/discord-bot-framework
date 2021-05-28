import { ApplicationCommandData, ApplicationCommand, CommandInteraction, ApplicationCommandOption, GuildResolvable } from 'discord.js';
import Client from '../../client/Client.js';
import { Index } from '../../util/extensions.js';
export declare type ApplicationCommandCallback = (interaction: CommandInteraction, client: Client) => void;
export declare type ApplicationCommandResolvable = ApplicationCommandConstructor | ApplicationCommandConstructorOptions;
export default class SlashCommandIndex {
    client: Client;
    cache: Index<string, ApplicationCommand>;
    callbacks: Index<string, ApplicationCommandCallback>;
    constructor(client: Client);
    create(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | undefined>;
}
export interface ApplicationCommandConstructorOptions extends ApplicationCommandData {
    callback?: ApplicationCommandCallback;
}
export declare class ApplicationCommandConstructor implements ApplicationCommandData {
    name: string;
    description: string;
    options: ApplicationCommandOption[];
    defaultPermission: boolean;
    callback?: ApplicationCommandCallback;
    constructor(options?: ApplicationCommandConstructorOptions);
    setName(name: string): this;
    setDescription(description: string): this;
    setDefaultPermission(defaultPermission?: boolean): this;
    addOptions(...options: ApplicationCommandOption[]): this;
    setCallback(callback: ApplicationCommandCallback): void;
    normalise(): ApplicationCommandData;
    toJSON(): string;
}
