import { ApplicationCommandOptionData as SlashCommandOptionData, ApplicationCommandOptionChoice as SlashCommandParameterChoice } from 'discord.js';
import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types';
declare enum SlashCommandOptionTypes {
    SubCommand = "SUB_COMMAND",
    SubCommandGroup = "SUB_COMMAND_GROUP",
    String = "STRING",
    Integer = "INTEGER",
    Boolean = "BOOLEAN",
    User = "USER",
    Channel = "CHANNEL",
    Role = "ROLE",
    Mentionable = "MENTIONABLE"
}
declare type SlashCommandParameterType = Exclude<keyof typeof SlashCommandOptionTypes, 'SubCommand' | 'SubCommandGroup'>;
interface SlashCommandParameterOptions {
    type: SlashCommandParameterType;
    name: string;
    description: string;
    required?: boolean;
    choices?: Iterable<SlashCommandParameterChoice>;
}
declare type SlashCommandParameterResolvable = Resolvable<SlashCommandParameterOptions> | Resolvable<SlashCommandParameter>;
declare class SlashCommandParameter {
    type: SlashCommandParameterType;
    name: string;
    description: string;
    required: boolean;
    choices: Collection<SlashCommandParameterChoice>;
    constructor(options?: Partial<SlashCommandParameterOptions>);
    repair(properties: Partial<SlashCommandParameterOptions>): this;
    addChoices(...choices: Resolvable<SlashCommandParameterChoice>[]): this;
    setType(type: SlashCommandParameterType): this;
    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    setName(name: string): this;
    /**
     * @param description 1-100 character description
     */
    setDescription(description: string): this;
    /**
     * @param required if the parameter is required or optional; default false
     */
    setRequired(required: boolean): this;
    get data(): SlashCommandOptionData;
}
export { SlashCommandParameterOptions, SlashCommandParameter, SlashCommandParameterChoice, SlashCommandParameterResolvable, SlashCommandParameterType, SlashCommandOptionTypes, SlashCommandOptionData };
export default SlashCommandParameter;
