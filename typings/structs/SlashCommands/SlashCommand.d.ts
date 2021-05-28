import Client from '../../client/Client.js';
import { Collection } from '../../util/extensions.js';
import { Interaction } from './Interaction.js';
export declare enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8
}
export declare type ApplicationCommandOptionTypeString = keyof typeof ApplicationCommandOptionType;
export declare type ApplicationCommandOptionTypeResolvable = ApplicationCommandOptionTypeString | ApplicationCommandOptionType;
export interface ApplicationCommandOptionChoice {
    /** 1-100 character choice name */
    name: string;
    /** Value of the choice, up to 100 characters if string */
    value: string | number;
}
export interface ApplicationCommandOption {
    /** Value of ApplicationCommandOptionTypeResolvable */
    type: ApplicationCommandOptionTypeResolvable;
    /** 1-32 character name matching `^[\w-]{1,32}$` */
    name: string;
    /** 1-100 character description */
    description: string;
    /** If the parameter is required or optional --default `false` */
    required?: boolean;
    /** Choices for `string` and `number` types for the user to pick from */
    choices?: ApplicationCommandOptionChoice[];
    /** If the option is a subcommand or subcommand group type, this nested options will be the parameters */
    options?: ApplicationCommandOption[];
}
export interface ApplicationCommand {
    /** The unique ID of your command */
    id: string;
    /** 1-32 character name matching `^[\w-]{1,32}$` */
    name: string;
    /** 1-100 character description */
    description: string;
    /** The parameters for the command */
    options?: ApplicationCommandOption[];
}
export interface APIApplicationCommandDetails extends Omit<ApplicationCommand, 'id'> {
    guildID?: string;
}
export interface ApplicationCommandDetails extends ApplicationCommand {
    guildID?: string;
}
export declare type SlashCallback = (interaction: Interaction, client: Client) => void;
export default class APISlashCommand {
    name: string;
    description: string;
    options: Collection<ApplicationCommandOption>;
    guildID: string | undefined;
    constructor(details?: Partial<APIApplicationCommandDetails>);
    /**
     * @param name The name of your slash command
     */
    setName(name: string): this;
    /**
     * @param description The description of your slash command
     */
    setDescription(description: string): this;
    /**
     * Add user input option(s)
     */
    addOptions(...options: ApplicationCommandOption[]): this;
    /**
     * The guild this slash command should be posted to
     * @param guildID The ID of a Discord server
     */
    setGuild(guildID: string): this;
    /**
     * @returns A JSON representation of this slash command
     */
    toJSON(): {
        name: string;
        description: string;
        options: ApplicationCommandOption[];
    };
}
export declare class SlashCommand {
    client: Client;
    id: string;
    name: string;
    description: string;
    guildID: string | undefined;
    options: ApplicationCommandOption[];
    constructor(client: Client, details: ApplicationCommandDetails);
    delete(): Promise<any>;
    edit(details: Partial<Omit<APIApplicationCommandDetails, 'guildID'>>): Promise<any>;
}
