import { Command, CommandOptions } from './Command.js';

export interface CommandManagerOptions {
    /**
     * - Categories your commands can belong to
     */
    categories?: string[];
}

export class CommandManager {
    #commands: Command[] = [];
    #categories: string[] = [];

    constructor(options?: CommandManagerOptions) {
        if (options?.categories && Array.isArray(options.categories)) this.#categories = options.categories;
    }

    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     */
    public add(command: Command | CommandOptions): Command {
        if (!command?.name || !command?.callback) throw new Error('Argument for \'command\' did not conform to either \'Command\' or \'CommandOptions\'');

        if (command.category && !this.#categories.includes(command.category)) throw new Error(`There is no existing command category named '${command.category}'`);

        const existingCommand = this.#commands.find(cmd => cmd.name === command.name);

        if (existingCommand) return existingCommand.edit({ ...command });

        const newCommand = command instanceof Command ? command : new Command({ ...command });

        this.#commands.push(newCommand);

        return newCommand;
    }

    /**
     * Removes an existing command and returns it
     */
    public remove(command: string | Command): Command | undefined {
        const existingCommand = this.#commands.find(i => i.name === command || i === command);

        if (!existingCommand) return;

        this.#commands.splice(this.#commands.indexOf(existingCommand), 1);

        return existingCommand;
    }

    /**
     * Returns a single command
     */
    public get(command: string | Command): Command | undefined {
        const existingCommand = this.#commands.find(i => i.name === command || i === command || i.category === command);

        if (existingCommand) return existingCommand;
    }

    /**
     * Returns an array of all commands
     */
    public all(): Command[] {
        const commands = this.#commands;

        return commands;
    }

    get categories() {
        return this.#categories;
    }
}