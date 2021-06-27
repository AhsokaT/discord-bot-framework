import { ApplicationCommandOptionData as APISlashCommandOption, ApplicationCommandOptionType as SlashCommandOptionType, ApplicationCommandOptionChoice as SlashCommandOptionChoice } from 'discord.js';
import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types';
interface SlashCommandOptionDetails {
    type: SlashCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: Iterable<SlashCommandOptionChoice>;
    options?: Iterable<this>;
}
declare type SlashCommandOptionResolvable = Resolvable<SlashCommandOptionDetails> | Resolvable<SlashCommandOption>;
declare class SlashCommandOption {
    type: SlashCommandOptionType;
    name: string;
    description: string;
    required: boolean;
    choices: Collection<SlashCommandOptionChoice>;
    options: Collection<SlashCommandOption>;
    constructor(options?: Partial<SlashCommandOptionDetails>);
    edit(properties: Partial<SlashCommandOptionDetails>): this;
    addChoices(...choices: Resolvable<SlashCommandOptionChoice>[]): this;
    addOptions(...options: SlashCommandOptionResolvable[]): this;
    setType(type: SlashCommandOptionType): this;
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
    toAPIObject(): APISlashCommandOption;
}
export { SlashCommandOptionDetails, SlashCommandOption, SlashCommandOptionChoice, SlashCommandOptionResolvable, SlashCommandOptionType, APISlashCommandOption };
export default SlashCommandOption;
