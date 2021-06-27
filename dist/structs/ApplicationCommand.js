"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
const SlashCommandOption_js_1 = require("./SlashCommandOption.js");
class ApplicationCommand {
    constructor(client, command, callback) {
        this.client = client;
        this.client = client;
        this.options = new js_augmentations_1.Collection();
        const { id, name, description, defaultPermission, guild, options } = command;
        this.id = id;
        this.name = name;
        this.guild = guild;
        this.description = description;
        this.defaultPermission = defaultPermission;
        this.callback = callback;
        options.forEach(option => this.options.add(new SlashCommandOption_js_1.default(option)));
        this.client.applicationCommands.cache.set(this.id, this);
    }
    get createdAt() {
        return discord_js_1.SnowflakeUtil.deconstruct(this.id).date;
    }
    async fetch() {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        const manager = this.guild ? this.guild.commands : this.client.application.commands;
        const fetched = await manager.fetch(this.id).catch(util_js_1.noop);
        return fetched ? new ApplicationCommand(this.client, fetched, this.callback) : null;
    }
    async delete() {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        const manager = this.guild ? this.guild.commands : this.client.application.commands;
        const deleted = await manager.delete(this.id);
        return deleted ? new ApplicationCommand(this.client, deleted, this.callback) : null;
    }
}
exports.default = ApplicationCommand;
