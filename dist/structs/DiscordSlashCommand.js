"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const SlashCommandParameter_js_1 = require("./SlashCommandParameter.js");
class DiscordSlashCommand {
    client;
    id;
    name;
    description;
    defaultPermission;
    options;
    callback;
    guild;
    deleted;
    constructor(client, data) {
        this.client = client;
        this.client = client;
        this.options = new js_augmentations_1.Collection();
        const { id, name, description, defaultPermission, guild, options, deleted = false, callback } = data;
        this.id = id;
        this.name = name;
        this.guild = guild;
        this.deleted = deleted;
        this.description = description;
        this.defaultPermission = defaultPermission;
        this.callback = callback ?? this.client.slashCommands.cache.get(this.id)?.callback ?? ((interaction) => interaction.reply({ content: '🛠️ This command is **under construction** 🏗️', ephemeral: true }));
        options.forEach(option => this.options.add(new SlashCommandParameter_js_1.default(option)));
        if (this.deleted)
            this.client.slashCommands.cache.delete(this.id);
        else
            this.client.slashCommands.cache.set(this.id, this);
    }
    get createdAt() {
        return discord_js_1.SnowflakeUtil.deconstruct(this.id).date;
    }
    async fetch() {
        return this.client.slashCommands.fetch(this);
    }
    async delete() {
        return this.client.slashCommands.delete(this);
    }
    async edit(data) {
        return this.client.slashCommands.edit(this, data);
    }
}
exports.default = DiscordSlashCommand;
