import { GuildResolvable } from 'discord.js';
import { Collection } from 'js-augmentations';
import { SlashCommandData } from './SlashCommand.js';
import SlashSubCommand from './SlashSubCommand.js';

class SlashSubCommandGroup {
    public name: string;
    public description: string;
    public commands: Collection<SlashSubCommand>;
    public guild: GuildResolvable | null;

    constructor() {
        this.guild = null;

        this.commands = new Collection();
    }

    public addCommands(...commands: SlashSubCommand[]): this {
        commands.forEach(command => {
            if (!command.name)
                throw new Error('Slash sub commands must have a name set.');

            if (!command.description)
                throw new Error('Slash sub commands must have a description set.');

            this.commands.add(command);
        });

        return this;
    }

    get data(): SlashCommandData {
        const { name, description, commands } = this;

        return { name, description, options: commands.map(({ data }) => data).array() };
    }
}