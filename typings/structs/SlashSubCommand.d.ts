import { CommandInteraction } from 'discord.js';
import { Collection } from 'js-augmentations';
import SlashCommandParameter, { SlashCommandOptionData } from './SlashCommandParameter.js';
declare type SlashSubCommandCallback = (this: SlashSubCommand, interaction: CommandInteraction) => void;
declare class SlashSubCommand {
    name: string;
    description: string;
    parameters: Collection<SlashCommandParameter>;
    callback: SlashSubCommandCallback;
    constructor();
    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    setName(name: string): this;
    /**
     * @param description 1-100 character description
     */
    setDescription(description: string): this;
    setCallback(callback: SlashSubCommandCallback): this;
    get data(): SlashCommandOptionData;
}
export default SlashSubCommand;
