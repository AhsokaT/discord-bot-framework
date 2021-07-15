"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
const SlashCommand_js_1 = require("./SlashCommand.js");
const DiscordSlashCommand_js_1 = require("./DiscordSlashCommand.js");
const util_js_1 = require("../util/util.js");
class SlashCommandManager {
    client;
    cache;
    constructor(client) {
        this.client = client;
        this.client = client;
        this.cache = new js_augmentations_1.Index();
        client.on('interaction', interaction => {
            if (!interaction.isCommand())
                return;
            const command = this.cache.get(interaction.commandID);
            if (command?.callback)
                command.callback.bind(command)(interaction, command, this.client);
        });
    }
    async create(command) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof SlashCommand_js_1.default))
            return this.create(new SlashCommand_js_1.default(command));
        const guild = command.guild ? await util_js_1.resolveGuild(this.client, command.guild) : null;
        const manager = guild ? guild.commands : this.client.application.commands;
        const existing = (await manager.fetch()).find(({ name }) => name === command.name);
        if (existing)
            return this.edit(new DiscordSlashCommand_js_1.default(this.client, existing), command);
        const posted = await manager.create(command.data);
        return new DiscordSlashCommand_js_1.default(this.client, { ...command, ...posted });
    }
    async edit(command, data) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof DiscordSlashCommand_js_1.default))
            return this.edit(await this.fetch(command), data);
        const manager = command.guild ? command.guild.commands : this.client.application.commands;
        const newCommand = new SlashCommand_js_1.default({ ...command, ...data });
        const editted = await manager.edit(command.id, newCommand.data);
        return new DiscordSlashCommand_js_1.default(this.client, { ...command, ...editted });
    }
    async delete(command, guild) {
        if (!this.client.application)
            throw new Error('The bot is not yet logged in: run this method in the client\'s \'ready\' event.');
        if (!(command instanceof DiscordSlashCommand_js_1.default))
            return this.delete(await this.fetch(command, guild));
        if (command.guild)
            guild = command.guild;
        else if (guild)
            guild = await util_js_1.resolveGuild(this.client, guild);
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
            guild = await util_js_1.resolveGuild(this.client, guild);
        const manager = guild ? guild.commands : this.client.application.commands;
        if (command)
            return new DiscordSlashCommand_js_1.default(this.client, await manager.fetch(command instanceof DiscordSlashCommand_js_1.default ? command.id : command));
        return new js_augmentations_1.Index([...(await manager.fetch()).map(i => new DiscordSlashCommand_js_1.default(this.client, i)).entries()]);
    }
}
exports.default = SlashCommandManager;
