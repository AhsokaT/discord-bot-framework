"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const SlashCommand_js_1 = require("./SlashCommand.js");
const DiscordSlashCommand_js_1 = require("./DiscordSlashCommand.js");
class DiscordSlashCommandManager {
    constructor(client) {
        this.client = client;
        this.client = client;
        this.cache = new js_augmentations_1.Index();
        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;
            const command = this.cache.get(interaction.commandID);
            if (command?.callback)
                command.callback(interaction, command, this.client);
        });
    }
    async create(command) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof SlashCommand_js_1.default))
            return this.create(new SlashCommand_js_1.default(command));
        const guild = command.guild ? await resolveGuild(command.guild, this.client) : null;
        const manager = guild ? guild.commands : this.client.application.commands;
        const existing = (await manager.fetch()).find(i => i.name === command.name);
        if (existing)
            return this.edit(new DiscordSlashCommand_js_1.default(this.client, existing), command);
        const posted = await manager.create(command.toAPIObject());
        return posted ? new DiscordSlashCommand_js_1.default(this.client, { ...command, ...posted }) : null;
    }
    async edit(command, data) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof DiscordSlashCommand_js_1.default))
            throw new TypeError(`Type ${typeof command} is not assignable to type 'DiscordSlashCommand'.`);
        const manager = command.guild ? command.guild.commands : this.client.application.commands;
        const newCommand = new SlashCommand_js_1.default({ ...command, ...data });
        const editted = await manager.edit(command.id, newCommand.toAPIObject());
        return new DiscordSlashCommand_js_1.default(this.client, { ...newCommand, ...editted });
    }
    async delete(command, guild) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof DiscordSlashCommand_js_1.default)) {
            const fetched = await this.fetch(command, guild);
            return fetched ? this.delete(fetched, guild) : null;
        }
        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);
        const manager = guild ? guild.commands : this.client.application.commands;
        const deleted = await manager.delete(command.id);
        return deleted ? new DiscordSlashCommand_js_1.default(this.client, { ...command, ...deleted, deleted: true }) : null;
    }
    async fetch(command, guild) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (command instanceof DiscordSlashCommand_js_1.default && command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);
        const manager = guild ? guild.commands : this.client.application.commands;
        if (command)
            return new DiscordSlashCommand_js_1.default(this.client, await manager.fetch(command instanceof DiscordSlashCommand_js_1.default ? command.id : command));
        return new js_augmentations_1.Index([...(await manager.fetch()).map(i => new DiscordSlashCommand_js_1.default(this.client, i)).entries()]);
    }
}
exports.default = DiscordSlashCommandManager;
function resolveGuild(guild, client) {
    if (guild instanceof discord_js_1.Guild)
        return guild;
    if (guild instanceof discord_js_1.GuildEmoji || guild instanceof discord_js_1.GuildMember || guild instanceof discord_js_1.GuildChannel || guild instanceof discord_js_1.Role)
        return guild.guild;
    if (guild instanceof discord_js_1.Invite) {
        if (guild.guild)
            return guild.guild.fetch();
        else
            return;
    }
    return client.guilds.fetch(guild);
}
