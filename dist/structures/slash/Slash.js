"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = void 0;
const SlashTypes_1 = require("./SlashTypes");
class SlashCommand {
    constructor(options) {
        this.#data = new Object();
        if (!options)
            return;
        const { name, description, options: opts, id, callback } = options;
        if (id)
            this.#data = { id: id };
        if (name)
            this.setName(name);
        if (callback)
            this.setCallback(callback);
        if (description)
            this.setDescription(description);
        if (Array.isArray(opts))
            this.addOption(...opts);
    }
    #data;
    checkOptions(options) {
        options.forEach(opt => {
            const { name, description, type, choices, required } = opt;
            if (!name || typeof name !== 'string')
                throw new Error('Slash command options must have a valid name set; a string with a length greater than zero.');
            if (!description || typeof description !== 'string')
                throw new Error('Slash command options must have a valid description set; a string with a length greater than zero.');
            if (!type || (typeof type !== 'string' && !(opt.type in SlashTypes_1.ApplicationCommandOptionType)))
                throw new Error('Slash command options must have a valid type set; of type ApplicationCommandOptionType.');
            if ('required' in opt && typeof required !== 'boolean')
                throw new Error('Property \'required\' must be a boolean.');
            if (Array.isArray(choices))
                choices.forEach(choice => {
                    if (!choice.name || typeof choice.name !== 'string')
                        throw new Error('Slash command option choices must have a name set.');
                });
            if (typeof opt.type === 'string')
                opt.type = SlashTypes_1.ApplicationCommandOptionType[opt.type];
            if (opt.options && Array.isArray(opt.options))
                this.checkOptions(opt.options);
        });
        return options;
    }
    /**
     * @param name The name of your slash command.
     */
    setName(name) {
        if (name && typeof name === 'string' && new RegExp(/^[\w-]{1,32}$/).test(name))
            this.#data.name = name;
        return this;
    }
    /**
     * @param description The description of your slash command.
     */
    setDescription(description) {
        if (description && typeof description === 'string' && description.length <= 100)
            this.#data.description = description;
        return this;
    }
    /**
     * @param callback The function to be executed when the command is run.
     */
    setCallback(callback) {
        if (typeof callback === 'function')
            this.#data.callback = callback;
        return this;
    }
    /**
     * Add a user input option
     */
    addOption(...options) {
        if (Array.isArray(options))
            options.forEach(option => {
                let opt = this.checkOptions([option]).shift();
                if (!this.#data.options)
                    this.#data.options = [];
                if (opt)
                    this.#data.options?.push(opt);
            });
        return this;
    }
    /**
     * @returns A JSON representation of this slash command.
     */
    toJSON() {
        const data = {
            name: this.name,
            description: this.description,
            options: this.options
        };
        return JSON.stringify(data);
    }
    get name() {
        return this.#data.name;
    }
    get description() {
        return this.#data.description;
    }
    get options() {
        return this.#data.options;
    }
    get id() {
        return this.#data.id;
    }
}
exports.SlashCommand = SlashCommand;
