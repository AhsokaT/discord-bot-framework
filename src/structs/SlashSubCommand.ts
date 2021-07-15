import { CommandInteraction } from 'discord.js';
import { Collection } from 'js-augmentations';
import SlashCommandParameter, { SlashCommandOptionData, SlashCommandOptionTypes } from './SlashCommandParameter.js';

type SlashSubCommandCallback = (this: SlashSubCommand, interaction: CommandInteraction) => void;

class SlashSubCommand {
    public name: string;
    public description: string;
    public parameters: Collection<SlashCommandParameter>;
    public callback: SlashSubCommandCallback;

    constructor() {
        this.parameters = new Collection();

        this.setCallback((interaction) => interaction.reply({ content: '🛠️ This command is **under construction** 🏗️', ephemeral: true }));
    }

    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    public setName(name: string): this {
        if (typeof name !== 'string')
            throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);

        if (!/^[\w-]{1,32}$/.test(name))
            throw new Error('Your argument for name does not match the regular expression ^[\w-]{1,32}$');

        this.name = name;

        return this;
    }

    /**
     * @param description 1-100 character description
     */
    public setDescription(description: string): this {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);

        if (description.length < 1)
            throw new Error('The description of a slash command cannot be less than 1 character long.');

        if (description.length > 100)
            throw new Error('The description of a slash command cannot be greater than 100 characters long.');

        this.description = description;

        return this;
    }

    public setCallback(callback: SlashSubCommandCallback): this {
        if (typeof callback !== 'function')
            throw new TypeError(`Type ${typeof callback} is not assignable to type 'SlashCommandCallback'.`);

        this.callback = callback;

        return this;
    }

    get data(): SlashCommandOptionData {
        const { name, description, parameters } = this;

        return { type: SlashCommandOptionTypes.SubCommand, name, description, options: parameters.map(({ data }) => data).array() };
    }
}

export default SlashSubCommand;