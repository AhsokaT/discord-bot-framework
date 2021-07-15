import { ApplicationCommandOptionData as SlashCommandOptionData, ApplicationCommandOptionChoice as SlashCommandParameterChoice } from 'discord.js';
import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types';
import { isIterable } from '../util/util.js';

enum SlashCommandOptionTypes {
    SubCommand = 'SUB_COMMAND',
    SubCommandGroup = 'SUB_COMMAND_GROUP',
    String = 'STRING',
    Integer = 'INTEGER',
    Boolean = 'BOOLEAN',
    User = 'USER',
    Channel = 'CHANNEL',
    Role = 'ROLE',
    Mentionable = 'MENTIONABLE'
}

type SlashCommandParameterType = Exclude<keyof typeof SlashCommandOptionTypes, 'SubCommand' | 'SubCommandGroup'>;

interface SlashCommandParameterOptions {
    type: SlashCommandParameterType;
    name: string;
    description: string;
    required?: boolean;
    choices?: Iterable<SlashCommandParameterChoice>;
    // options?: Iterable<this>;
}

type SlashCommandParameterResolvable =
    | Resolvable<SlashCommandParameterOptions>
    | Resolvable<SlashCommandParameter>;

class SlashCommandParameter {
    public type: SlashCommandParameterType;
    public name: string;
    public description: string;
    public required: boolean;
    public choices: Collection<SlashCommandParameterChoice>;

    constructor(options?: Partial<SlashCommandParameterOptions>) {
        this.choices = new Collection();

        this.setRequired(false);

        if (options)
            this.repair(options);
    }

    public repair(properties: Partial<SlashCommandParameterOptions>): this {
        if (typeof properties !== 'object')
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'ApplicationCommandOptionDetails'.`);

        const { name, description, type, required, choices } = properties;

        if (name)
            this.setName(name);

        if (description)
            this.setDescription(description);

        if (type)
            this.setType(type);

        if (typeof required === 'boolean')
            this.setRequired(required);

        if (choices && isIterable(choices))
            this.addChoices(...choices);

        return this;
    }

    public addChoices(...choices: Resolvable<SlashCommandParameterChoice>[]): this {
        choices.flatMap(i => isIterable(i) ? [...i] : i).forEach(choice => {
            if (typeof choice.name !== 'string')
                throw new TypeError(`Type ${typeof choice.name} is not assignable to type 'string'.`);

            if (typeof choice.value !== 'string' || typeof choice.value !== 'number')
                throw new TypeError(`Type ${typeof choice.value} is not assignable to type 'number | string'.`);

            this.choices.add(choice);
        });

        return this;
    }

    // public addOptions(...options: SlashCommandParameterResolvable[]): this {
    //     options.map(i => isIterable(i) ? [...i] : i).flat().forEach(option => {
    //         if (!(option instanceof SlashCommandParameter))
    //             return this.addOptions(new SlashCommandParameter(option));

    //         this.options.add(option);
    //     });

    //     return this;
    // }

    public setType(type: SlashCommandParameterType): this {
        if (!['String', 'Integer', 'Boolean', 'User', 'Channel', 'Role', 'Mentionable'].includes(type))
            throw new TypeError(`Type ${typeof type} is not assignable to type 'SlashCommandOptionType'.`);

        this.type = type;

        return this;
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

    /**
     * @param required if the parameter is required or optional; default false
     */
    public setRequired(required: boolean): this {
        if (typeof required !== 'boolean')
            throw new TypeError(`Type '${typeof required}' is not assignable to type 'boolean'.`);

        this.required = required;

        return this;
    }

    get data(): SlashCommandOptionData {
        const { type, name, description, required, choices } = this;

        return { type: SlashCommandOptionTypes[type], name, description, required, choices: choices.array() };
    }
}

export {
    SlashCommandParameterOptions,
    SlashCommandParameter,
    SlashCommandParameterChoice,
    SlashCommandParameterResolvable,
    SlashCommandParameterType,
    SlashCommandOptionTypes,
    SlashCommandOptionData
}

export default SlashCommandParameter;