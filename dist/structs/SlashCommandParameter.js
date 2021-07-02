"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommandOptionTypes = exports.SlashCommandParameter = void 0;
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
var SlashCommandOptionTypes;
(function (SlashCommandOptionTypes) {
    SlashCommandOptionTypes["SubCommand"] = "SUB_COMMAND";
    SlashCommandOptionTypes["SubCommandGroup"] = "SUB_COMMAND_GROUP";
    SlashCommandOptionTypes["String"] = "STRING";
    SlashCommandOptionTypes["Integer"] = "INTEGER";
    SlashCommandOptionTypes["Boolean"] = "BOOLEAN";
    SlashCommandOptionTypes["User"] = "USER";
    SlashCommandOptionTypes["Channel"] = "CHANNEL";
    SlashCommandOptionTypes["Role"] = "ROLE";
    SlashCommandOptionTypes["Mentionable"] = "MENTIONABLE";
})(SlashCommandOptionTypes || (SlashCommandOptionTypes = {}));
exports.SlashCommandOptionTypes = SlashCommandOptionTypes;
class SlashCommandParameter {
    type;
    name;
    description;
    required;
    choices;
    constructor(options) {
        this.choices = new js_augmentations_1.Collection();
        this.setRequired(false);
        if (options)
            this.edit(options);
    }
    edit(properties) {
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
        if (choices && util_js_1.isIterable(choices))
            this.addChoices(...choices);
        return this;
    }
    addChoices(...choices) {
        choices.flatMap(i => util_js_1.isIterable(i) ? [...i] : i).forEach(choice => {
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
    setType(type) {
        if (!['String', 'Integer', 'Boolean', 'User', 'Channel', 'Role', 'Mentionable'].includes(type))
            throw new TypeError(`Type ${typeof type} is not assignable to type 'SlashCommandOptionType'.`);
        this.type = type;
        return this;
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
    /**
     * @param required if the parameter is required or optional; default false
     */
    setRequired(required) {
        if (typeof required !== 'boolean')
            throw new TypeError(`Type '${typeof required}' is not assignable to type 'boolean'.`);
        this.required = required;
        return this;
    }
    get data() {
        const { type, name, description, required, choices } = this;
        return { type: SlashCommandOptionTypes[type], name, description, required, choices: choices.array() };
    }
}
exports.SlashCommandParameter = SlashCommandParameter;
exports.default = SlashCommandParameter;
