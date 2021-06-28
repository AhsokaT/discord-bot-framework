"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
const SlashCommandOption_js_1 = require("./SlashCommandOption.js");
class SlashCommand {
    constructor(options) {
        this.guild = null;
        this.options = new js_augmentations_1.Collection();
        this.setDefaultPermission(true);
        this.setCallback((interaction) => interaction.reply({ content: '🛠️ This command is **under construction** 🏗️', ephemeral: true }));
        if (options)
            this.edit(options);
    }
    edit(options) {
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
        if (opts && util_js_1.isIterable(opts))
            this.addOptions(...opts);
        return this;
    }
    setCallback(callback) {
        if (typeof callback !== 'function')
            throw new TypeError(`Type ${typeof callback} is not assignable to type 'SlashCommandCallback'.`);
        this.callback = callback;
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
     * @param defaultPermission whether the command is enabled by default when the app is added to a guild
     */
    setDefaultPermission(defaultPermission) {
        if (typeof defaultPermission !== 'boolean')
            throw new TypeError(`Type ${typeof defaultPermission} is not assignable to type 'boolean'.`);
        this.defaultPermission = defaultPermission;
        return this;
    }
    setGuild(guild) {
        if (!(guild instanceof discord_js_1.Guild || guild instanceof discord_js_1.GuildEmoji || guild instanceof discord_js_1.GuildMember || guild instanceof discord_js_1.GuildChannel || guild instanceof discord_js_1.Role || typeof guild === 'string'))
            throw new TypeError(`Type ${typeof guild} is not assignable to type 'GuildResolvable'.`);
        this.guild = guild;
        return this;
    }
    addOptions(...options) {
        options.map(i => util_js_1.isIterable(i) ? [...i] : i).flat().forEach(option => {
            if (!(option instanceof SlashCommandOption_js_1.default))
                return this.addOptions(new SlashCommandOption_js_1.default(option));
            this.options.add(option);
        });
        return this;
    }
    toAPIObject() {
        const { name, description, defaultPermission, options } = this;
        return { name, description, defaultPermission, options: options.map(param => param.toAPIObject()).array() };
    }
}
exports.default = SlashCommand;
