import Client from '../../client/Client.js';
import { Group } from '../../util/extensions.js';
import { Interaction } from './Interaction.js';

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

export type SlashCallback = (interaction: Interaction, client: Client) => void;

export default class APISlashCommand {
    public name: string;
    public description: string;
    public options: Group<ApplicationCommandOption>;
    public guildID: string | undefined;

    constructor(details: Partial<APIApplicationCommandDetails> = {}) {
        const { name, description, options, guildID } = details;

        this.options = new Group();

        if (name) this.setName(name);
        if (description) this.setDescription(description);
        if (Array.isArray(options)) this.addOptions(...options);
        if (guildID) this.setGuild(guildID);
    }

    /**
     * @param name The name of your slash command
     */
     public setName(name: string): this {
        if (name && typeof name === 'string' && new RegExp(/^[\w-]{1,32}$/).test(name)) this.name = name.toLowerCase();

        return this;
    }

    /**
     * @param description The description of your slash command
     */
    public setDescription(description: string): this {
        if (description && typeof description === 'string' && description.length <= 100) this.description = description;

        return this;
    }

    /**
     * Add user input option(s)
     */
    public addOptions(...options: ApplicationCommandOption[]): this {
        resolveOptions(...options).forEach(option => this.options.add(option));

        return this;
    }

    /**
     * The guild this slash command should be posted to
     * @param guildID The ID of a Discord server
     */
    public setGuild(guildID: string) {
        if (typeof guildID === 'string') this.guildID = guildID;

        return this;
    }

    /**
     * @returns A JSON representation of this slash command
     */
    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options.array()
        };
    }
}

export class SlashCommand {
    public client: Client;
    public id: string;
    public name: string;
    public description: string;
    public guildID: string | undefined;
    public options: ApplicationCommandOption[];

    constructor(client: Client, details: ApplicationCommandDetails) {
        const { name, description, options = [], id, guildID } = details;

        this.id = id;
        this.name = name;
        this.client = client;
        this.options = options;
        this.description = description;
        if (guildID) this.guildID = guildID;
    }

    public async delete() {
        return this.client.slashCommands.delete(this);
    }

    public async edit(details: Omit<APIApplicationCommandDetails, 'guildID'>) {
        return this.client.slashCommands.edit(this, details);
    }
}

function resolveOptions(...options: ApplicationCommandOption[]): ApplicationCommandOption[] {
    options.forEach(opt => {
        const { name, description, type, choices, required } = opt;

        if (!name || typeof name !== 'string') throw new Error('Slash command options must have a valid name set; a string with a length greater than zero.');
        if (!description || typeof description !== 'string') throw new Error('Slash command options must have a valid description set; a string with a length greater than zero.');
        if (!type || (typeof type !== 'string' && !(opt.type in ApplicationCommandOptionType))) throw new Error('Slash command options must have a valid type set; of type ApplicationCommandOptionType.');
        if ('required' in opt && typeof required !== 'boolean') throw new Error('Property \'required\' must be a boolean.');
        if (Array.isArray(choices)) choices.forEach(choice => {
            if (!choice.name || typeof choice.name !== 'string') throw new Error('Slash command option choices must have a name set.');
        });

        if (typeof opt.type === 'string') opt.type = ApplicationCommandOptionType[opt.type];

        if (Array.isArray(opt.options)) opt.options = resolveOptions(...opt.options);
    });

    return options;
}