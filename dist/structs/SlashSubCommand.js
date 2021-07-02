"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
const SlashCommandParameter_js_1 = require("./SlashCommandParameter.js");
class SlashSubCommand {
    name;
    description;
    parameters;
    callback;
    constructor() {
        this.parameters = new js_augmentations_1.Collection();
        this.setCallback((interaction) => interaction.reply({ content: '🛠️ This command is **under construction** 🏗️', ephemeral: true }));
    }
    /**
     * @param name 1-32 lowercase character name matching ^[\w-]{1,32}$
     */
    setName(name) {
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
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);
        if (description.length < 1)
            throw new Error('The description of a slash command cannot be less than 1 character long.');
        if (description.length > 100)
            throw new Error('The description of a slash command cannot be greater than 100 characters long.');
        this.description = description;
        return this;
    }
    setCallback(callback) {
        if (typeof callback !== 'function')
            throw new TypeError(`Type ${typeof callback} is not assignable to type 'SlashCommandCallback'.`);
        this.callback = callback;
        return this;
    }
    get data() {
        const { name, description, parameters } = this;
        return { type: SlashCommandParameter_js_1.SlashCommandOptionTypes.SubCommand, name, description, options: parameters.map(({ data }) => data).array() };
    }
}
exports.default = SlashSubCommand;
