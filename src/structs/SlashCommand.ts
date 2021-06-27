import { CommandInteraction, ApplicationCommandData as APISlashCommand, GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Role } from 'discord.js';
import { Collection } from 'js-augmentations';
import Client from '../client/Client.js';
import { isIterable } from '../util/util.js';
import ApplicationCommand from './ApplicationCommand.js';
import SlashCommandOption, { SlashCommandOptionResolvable } from './SlashCommandOption.js';

type SlashCommandCallback = (interaction: CommandInteraction, command: ApplicationCommand, client: Client) => void;

interface SlashCommandOptions {
    name: string;
    description: string;
    guild?: GuildResolvable | null;
    options?: Collection<SlashCommandOption>;
    defaultPermission?: boolean;
    callback?: SlashCommandCallback;
}

type SlashCommandResolvable =
    | SlashCommand
    | SlashCommandOptions;

class SlashCommand {
    public name: string;
    public description: string;
    public guild: GuildResolvable | null;
    public options: Collection<SlashCommandOption>;
    public defaultPermission: boolean;
    public callback: SlashCommandCallback;

    constructor(options?: Partial<SlashCommandOptions>) {
        this.guild = null;
        this.options = new Collection();

        this.setDefaultPermission(true);
        this.setCallback((interaction) => interaction.reply({ content: '❌ This command has not yet been programmed', ephemeral: true }));

        if (options)
            this.edit(options);
    }

    public edit(options: Partial<SlashCommandOptions>): this {
        if (typeof options !== 'object')
            throw new TypeError(`Type '${typeof options}' does not conform to type 'SlashCommandOptions'.`);

        const { name, description, guild, options: opts, defaultPermission, callback } = options;

        if (name)
            this.setName(name);

        if (description)
            this.setDescription(description);

        if (guild)
            this.setGuild(guild);

        if (typeof defaultPermission === 'boolean')
            this.setDefaultPermission(defaultPermission);

        if (callback)
            this.setCallback(callback);

        if (isIterable(opts))
            this.addOptions(...opts);

        return this;
    }

    public setCallback(callback: SlashCommandCallback): this {
        if (typeof callback !== 'function')
            throw new TypeError(`Type ${typeof callback} is not assignable to type 'SlashCommandCallback'.`);

        this.callback = callback;

        return this;
    }

    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    public setName(name: string): this {
        if (typeof name !== 'string')
            throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);

        // if (/^[\w-]{1,32}$/.test(name))
        //     throw new Error('Your argument for name does not match the regular expression ^[\w-]{1,32}$');

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
     * @param defaultPermission whether the command is enabled by default when the app is added to a guild
     */
    public setDefaultPermission(defaultPermission: boolean): this {
        if (typeof defaultPermission !== 'boolean')
            throw new TypeError(`Type ${typeof defaultPermission} is not assignable to type 'boolean'.`);

        this.defaultPermission = defaultPermission;

        return this;
    }

    public setGuild(guild: GuildResolvable): this {
        if (!(guild instanceof Guild || guild instanceof GuildEmoji || guild instanceof GuildMember || guild instanceof GuildChannel || guild instanceof Role || typeof guild === 'string'))
            throw new TypeError(`Type ${typeof guild} is not assignable to type 'GuildResolvable'.`);

        this.guild = guild;

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

    public toAPIObject(): APISlashCommand {
        const { name, description, defaultPermission, options } = this;        

        return { name, description, defaultPermission, options: options.map(param => param.toAPIObject()).array() };
    }
}

export {
    SlashCommandOptions,
    SlashCommandCallback,
    SlashCommandResolvable
}

export default SlashCommand;