"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandConstructor = void 0;
const discord_js_1 = require("discord.js");
const extensions_js_1 = require("../../util/extensions.js");
const util_js_1 = require("../../util/util.js");
class SlashCommandIndex {
    constructor(client) {
        this.client = client;
        this.client = client;
        this.callbacks = new extensions_js_1.Index();
        this.cache = new extensions_js_1.Index();
        client.on('applicationCommandCreate', command => this.cache.set(command.id, command));
        client.on('applicationCommandDelete', command => this.cache.delete(command.id));
        client.on('applicationCommandUpdate', (oldCommand, newCommand) => this.cache.set(newCommand.id, newCommand));
        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;
            const callback = this.callbacks.get(interaction.id);
            if (callback)
                callback(interaction, client);
        });
    }
    async create(command, guild) {
        let posted = null;
        if (guild) {
            const resolvedGuild = await resolveGuild(guild, this.client);
            if (!resolvedGuild)
                return;
            posted = await resolvedGuild.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
        }
        else {
            if (!this.client.readyAt) {
                this.client.on('ready', async () => {
                    if (!this.client.application)
                        return;
                    posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
                });
            }
            else {
                if (!this.client.application)
                    return;
                posted = await this.client.application?.commands.create(command instanceof ApplicationCommandConstructor ? command.normalise() : command);
            }
        }
        if (!posted)
            return;
        this.cache.set(posted.id, posted);
        if (command.callback)
            this.callbacks.set(posted.id, command.callback);
        return posted;
    }
}
exports.default = SlashCommandIndex;
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
        this.callback = callback;
    }
    normalise() {
        return { ...this };
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
        return;
    }
    return client.guilds.fetch(guild);
}
