import { Interaction } from './Interaction.js';
import { Client } from '../client/Client.js';

export type Snowflake = string | bigint;

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE
}

export type ApplicationCommandOptionTypeString = keyof typeof ApplicationCommandOptionType;

export type ApplicationCommandOptionTypeResolvable = ApplicationCommandOptionTypeString | ApplicationCommandOptionType;

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
    /** Automatically assigned when posted */
    readonly id: Snowflake;
    /** 1-32 character name matching `^[\w-]{1,32}$` */
    name: string;
    /** 1-100 character description */
    description: string;
    /** The parameters for the command */
    options?: ApplicationCommandOption[];
}

export interface SlashCommandOptions extends Partial<ApplicationCommand> {
    /** The function to be executed when this command is run */
    callback?: SlashCallback;
}

export type SlashCallback = (interaction: Interaction, client: Client) => void;