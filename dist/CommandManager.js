"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Command_js_1 = require("./Command.js");
class CommandManager {
    constructor(options) {
        this.#commands = [];
        this.#categories = [];
        if (options?.categories && Array.isArray(options.categories))
            this.#categories = options.categories;
    }
    #commands;
    #categories;
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     */
    add(command) {
        if (!command?.name || !command?.callback)
            throw new Error('Argument for \'command\' did not conform to either \'Command\' or \'CommandOptions\'');
        if (command.category && !this.#categories.includes(command.category))
            throw new Error(`There is no existing command category named '${command.category}'`);
        const existingCommand = this.#commands.find(cmd => cmd.name === command.name);
        if (existingCommand)
            return existingCommand.edit({ ...command });
        const newCommand = command instanceof Command_js_1.Command ? command : new Command_js_1.Command({ ...command });
        this.#commands.push(newCommand);
        return newCommand;
    }
    /**
     * Removes an existing command and returns it
     */
    remove(command) {
        const existingCommand = this.#commands.find(i => i.name === command || i === command);
        if (!existingCommand)
            return;
        this.#commands.splice(this.#commands.indexOf(existingCommand), 1);
        return existingCommand;
    }
    /**
     * Returns a single command
     */
    get(command) {
        const existingCommand = this.#commands.find(i => i.name === command || i === command || i.aliases.includes(command.toString()));
        if (existingCommand)
            return existingCommand;
    }
    /**
     * Returns an array of all commands
     */
    all() {
        const commands = this.#commands;
        return commands;
    }
    get categories() {
        return this.#categories;
    }
}
exports.CommandManager = CommandManager;
