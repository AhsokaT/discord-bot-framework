import { ApplicationCommandOptionData as APISlashCommandOptionData, ApplicationCommandOptionType as SlashCommandOptionType, ApplicationCommandOptionChoice as SlashCommandOptionChoice } from 'discord.js';
import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types';
import { isIterable } from '../util/util.js';

interface SlashCommandOptionDetails {
    type: SlashCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: Iterable<SlashCommandOptionChoice>;
    options?: Iterable<this>;
}

type SlashCommandOptionResolvable =
    | Resolvable<SlashCommandOptionDetails>
    | Resolvable<SlashCommandOption>;

class SlashCommandOption {
    public type: SlashCommandOptionType;
    public name: string;
    public description: string;
    public required: boolean;
    public choices: Collection<SlashCommandOptionChoice>;
    public options: Collection<SlashCommandOption>;

    constructor(options?: Partial<SlashCommandOptionDetails>) {
        this.choices = new Collection();
        this.options = new Collection();

        this.setRequired(false);

        if (options)
            this.edit(options);
    }

    public edit(properties: Partial<SlashCommandOptionDetails>): this {
        if (typeof properties !== 'object')
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'ApplicationCommandOptionDetails'.`);

        const { name, description, type, required, choices, options } = properties;

        if (name)
            this.setName(name);

        if (description)
            this.setDescription(description);

        if (type)
            this.setType(type);

        if (typeof required === 'boolean')
            this.setRequired(required);

        if (isIterable(choices))
            this.addChoices(...choices);

        if (isIterable(options))
            this.addOptions(...options);

        return this;
    }

    public addChoices(...choices: Resolvable<SlashCommandOptionChoice>[]): this {
        choices.flatMap(i => isIterable(i) ? [...i] : i).forEach(choice => {
            if (typeof choice.name !== 'string')
                throw new TypeError(`Type ${typeof choice.name} is not assignable to type 'string'.`);

            if (typeof choice.value !== 'string' || typeof choice.value !== 'number')
                throw new TypeError(`Type ${typeof choice.value} is not assignable to type 'number | string'.`);

            this.choices.add(choice);
        });

        return this;
    }

    public addOptions(...options: SlashCommandOptionResolvable[]): this {
        options.map(i => isIterable(i) ? [...i] : i).flat().forEach(option => {
            if (!(option instanceof SlashCommandOption))
                return this.addOptions(new SlashCommandOption(option));

            this.options.add(option);
        });

        return this;
    }

    public setType(type: SlashCommandOptionType): this {
        if (!['SUB_COMMAND', 'SUB_COMMAND_GROUP', 'STRING', 'INTEGER', 'BOOLEAN', 'USER', 'CHANNEL', 'ROLE', 'MENTIONABLE'].includes(type))
            throw new TypeError(`Type ${typeof type} is not assignable to type 'ApplicationCommandOptionType'.`);

        this.type = type;

        return this;
    }

    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    public setName(name: string): this {
        if (typeof name !== 'string')
            throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);

        if (/^[\w-]{1,32}$/.test(name))
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

    /** 
     * @param required if the parameter is required or optional; default false
     */
    public setRequired(required: boolean): this {
        if (typeof required !== 'boolean')
            throw new TypeError(`Type '${typeof required}' is not assignable to type 'boolean'.`);

        this.required = required;

        return this;
    }

    public toAPIObject(): APISlashCommandOptionData {
        const { type, name, description, required, choices, options } = this;

        return { type, name, description, required, choices: choices.array(), options: options.map(param => param.toAPIObject()).array() };
    }
}

export {
    SlashCommandOptionDetails,
    SlashCommandOption,
    SlashCommandOptionChoice,
    SlashCommandOptionResolvable,
    SlashCommandOptionType,
    APISlashCommandOptionData
}

export default SlashCommandOption;