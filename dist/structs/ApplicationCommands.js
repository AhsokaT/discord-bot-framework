"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandConstructor = void 0;
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
class ApplicationCommandManager {
    constructor(client) {
        this.client = client;
        this.client = client;
        this.callbacks = new js_augmentations_1.Index();
        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;
            const callback = this.callbacks.get(interaction.commandID);
            if (callback)
                callback(interaction, client);
        });
    }
    async create(command, guild) {
        if (!this.client.application)
            throw new Error('This method must be used inside the ready event');
        let posted = undefined;
        if (guild) {
            const resolved = await resolveGuild(guild, this.client);
            if (!resolved)
                return;
            const existing = await resolved.commands.fetch();
            if (existing.find(item => item.name === command.name)) {
                console.log('returned existing');
                return existing.find(item => item.name === command.name);
            }
            posted = await resolved.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        }
        else {
            const existing = await this.client.application.commands.fetch();
            if (existing.find(item => item.name === command.name)) {
                console.log('returned existing');
                return existing.find(item => item.name === command.name);
            }
            posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        }
        if (!posted)
            return;
        if (command.callback)
            this.callbacks.set(posted.id, command.callback);
        return posted;
    }
}
exports.default = ApplicationCommandManager;
class ApplicationCommandConstructor {
    constructor(options) {
        this.options = [];
        this.setName(options?.name ?? '');
        this.setDescription(options?.description ?? '');
        this.setCallback(options?.callback ?? util_js_1.noop);
        if (options && Array.isArray(options?.options))
            this.addOptions(...options.options);
    }
    setName(name) {
        if (typeof name !== 'string')
            throw new TypeError(`${typeof name} is not a string`);
        this.name = name;
        return this;
    }
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`${typeof description} is not a string`);
        this.description = description;
        return this;
    }
    setDefaultPermission(defaultPermission = true) {
        this.defaultPermission = Boolean(defaultPermission);
        return this;
    }
    addOptions(...options) {
        this.options.push(...options);
        return this;
    }
    setCallback(callback) {
        if (typeof callback !== 'function')
            throw new TypeError(`${typeof callback} is not a function`);
        this.callback = callback;
        return this;
    }
    normalise() {
        const { callback, ...self } = this;
        return self;
    }
    toJSON() {
        return JSON.stringify(this.normalise());
    }
}
exports.ApplicationCommandConstructor = ApplicationCommandConstructor;
function resolveGuild(guild, client) {
    if (guild instanceof discord_js_1.Guild)
        return guild;
    if (guild instanceof discord_js_1.GuildEmoji || guild instanceof discord_js_1.GuildMember || guild instanceof discord_js_1.GuildChannel || guild instanceof discord_js_1.Role)
        return guild.guild;
    if (guild instanceof discord_js_1.Invite) {
        if (guild.guild)
            return guild.guild;
        else
            return;
    }
    return client.guilds.fetch(guild);
}
