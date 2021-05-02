"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = exports.ApplicationCommandOptionType = void 0;
const extensions_js_1 = require("../../util/extensions.js");
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionType[ApplicationCommandOptionType["STRING"] = 3] = "STRING";
    ApplicationCommandOptionType[ApplicationCommandOptionType["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionType[ApplicationCommandOptionType["USER"] = 6] = "USER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionType[ApplicationCommandOptionType["ROLE"] = 8] = "ROLE";
})(ApplicationCommandOptionType = exports.ApplicationCommandOptionType || (exports.ApplicationCommandOptionType = {}));
class APISlashCommand {
    constructor(details = {}) {
        const { name, description, options, guildID } = details;
        this.options = new extensions_js_1.Group();
        if (name)
            this.setName(name);
        if (description)
            this.setDescription(description);
        if (Array.isArray(options))
            this.addOptions(...options);
        if (guildID)
            this.setGuild(guildID);
    }
    /**
     * @param name The name of your slash command
     */
    setName(name) {
        if (name && typeof name === 'string' && new RegExp(/^[\w-]{1,32}$/).test(name))
            this.name = name.toLowerCase();
        return this;
    }
    /**
     * @param description The description of your slash command
     */
    setDescription(description) {
        if (description && typeof description === 'string' && description.length <= 100)
            this.description = description;
        return this;
    }
    /**
     * Add user input option(s)
     */
    addOptions(...options) {
        resolveOptions(...options).forEach(option => this.options.add(option));
        return this;
    }
    /**
     * The guild this slash command should be posted to
     * @param guildID The ID of a Discord server
     */
    setGuild(guildID) {
        if (typeof guildID === 'string')
            this.guildID = guildID;
        return this;
    }
    /**
     * @returns A JSON representation of this slash command
     */
    toJSON() {
        return {
            name: this.name,
            description: this.description,
            options: this.options.array()
        };
    }
}
exports.default = APISlashCommand;
class SlashCommand {
    constructor(client, details) {
        const { name, description, options = [], id, guildID } = details;
        this.id = id;
        this.name = name;
        this.client = client;
        this.options = options;
        this.description = description;
        if (guildID)
            this.guildID = guildID;
    }
    async delete() {
        return this.client.slashCommands.delete(this);
    }
    async edit(details) {
        return this.client.slashCommands.edit(this, details);
    }
}
exports.SlashCommand = SlashCommand;
function resolveOptions(...options) {
    options.forEach(opt => {
        const { name, description, type, choices, required } = opt;
        if (!name || typeof name !== 'string')
            throw new Error('Slash command options must have a valid name set; a string with a length greater than zero.');
        if (!description || typeof description !== 'string')
            throw new Error('Slash command options must have a valid description set; a string with a length greater than zero.');
        if (!type || (typeof type !== 'string' && !(opt.type in ApplicationCommandOptionType)))
            throw new Error('Slash command options must have a valid type set; of type ApplicationCommandOptionType.');
        if ('required' in opt && typeof required !== 'boolean')
            throw new Error('Property \'required\' must be a boolean.');
        if (Array.isArray(choices))
            choices.forEach(choice => {
                if (!choice.name || typeof choice.name !== 'string')
                    throw new Error('Slash command option choices must have a name set.');
            });
        if (typeof opt.type === 'string')
            opt.type = ApplicationCommandOptionType[opt.type];
        if (Array.isArray(opt.options))
            opt.options = resolveOptions(...opt.options);
    });
    return options;
}
