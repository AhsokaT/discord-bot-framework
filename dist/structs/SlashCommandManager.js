"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const js_augmentations_1 = require("js-augmentations");
const APISlashCommand_js_1 = require("./APISlashCommand.js");
const ApplicationCommand_js_1 = require("./ApplicationCommand.js");
class ApplicationCommandManager {
    constructor(client) {
        this.client = client;
        this.client = client;
        this.cache = new js_augmentations_1.Index();
        client.on('interaction', interaction => {
            console.log(`Interaction: ${interaction.isCommand()}`);
            if (!interaction.isCommand())
                return;
            const command = this.cache.get(interaction.commandID);
            if (command && command.callback)
                command.callback(interaction, command, this.client);
        });
    }
    async post(command) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof APISlashCommand_js_1.default))
            return this.post(new APISlashCommand_js_1.default(command));
        const guild = command.guild ? await resolveGuild(command.guild, this.client) : null;
        const manager = guild ? guild.commands : this.client.application.commands;
        const existing = (await manager.fetch()).find(i => i.name === command.name);
        if (existing)
            return this.edit(new ApplicationCommand_js_1.default(this.client, { ...existing, deleted: false }, command.callback), command);
        const posted = await manager.create(command.toAPIObject());
        return posted ? new ApplicationCommand_js_1.default(this.client, { ...posted, deleted: false }, command.callback) : null;
    }
    async edit(command, data) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof ApplicationCommand_js_1.default))
            throw new TypeError(`Type ${typeof command} is not assignable to type 'ApplicationCommand'.`);
        const manager = command.guild ? command.guild.commands : this.client.application.commands;
        const editted = await manager.edit(command.id, new APISlashCommand_js_1.default({ ...command, ...data }).toAPIObject());
        return editted ? new ApplicationCommand_js_1.default(this.client, { ...editted, deleted: false }, command.callback) : null;
    }
    async delete(command, guild) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof ApplicationCommand_js_1.default)) {
            const fetched = await this.fetch(command, guild);
            return fetched ? this.delete(fetched, guild) : null;
        }
        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);
        const manager = guild ? guild.commands : this.client.application.commands;
        const deleted = manager.delete(command.id);
        return deleted ? new ApplicationCommand_js_1.default(this.client, { ...deleted, deleted: true }, command.callback) : null;
    }
    async fetch(command, guild) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (command instanceof ApplicationCommand_js_1.default && command.guild)
            guild = command.guild;
        else if (guild)
            guild = await resolveGuild(guild, this.client);
        const manager = guild ? guild.commands : this.client.application.commands;
        const fetched = await manager.fetch(command instanceof ApplicationCommand_js_1.default ? command.id : command);
        const callback = this.cache.get(fetched.id)?.callback;
        return fetched ? new ApplicationCommand_js_1.default(this.client, { ...fetched, deleted: false }, callback ?? null) : null;
    }
}
exports.default = ApplicationCommandManager;
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
