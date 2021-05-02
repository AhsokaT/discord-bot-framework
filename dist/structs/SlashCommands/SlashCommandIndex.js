"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const extensions_js_1 = require("../../util/extensions.js");
const SlashCommand_js_1 = require("./SlashCommand.js");
const events_1 = require("events");
const Interaction_js_1 = require("./Interaction.js");
class SlashCommandIndex extends events_1.EventEmitter {
    constructor(client) {
        super();
        this.client = client;
        this.cache = new extensions_js_1.Index();
        this.callbacks = new extensions_js_1.Index();
        this.application = null;
        // @ts-expect-error
        this.client.ws.on('INTERACTION_CREATE', async (interaction) => {
            if (!this.application)
                this.application = await this.client.fetchApplication();
            const channel = await this.client.channels.fetch(interaction.channel_id).catch(() => undefined);
            if (!(channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel) && channel !== undefined)
                return;
            const member = await channel?.guild.members.fetch(interaction.member.user.id).catch(() => undefined) ?? undefined;
            const command = await this.fetch(interaction.data.id, interaction.guild_id);
            if (!command)
                return;
            const ResolvedInteraction = new Interaction_js_1.Interaction({
                member,
                channel,
                client: this.client,
                id: interaction.id,
                token: interaction.token,
                guildID: interaction.guild_id,
                options: Array.isArray(interaction.data.options) ? new extensions_js_1.Index(...interaction.data.options.map(opt => [opt.name, opt.value])) : new extensions_js_1.Index(),
                application: this.application,
                command: command
            });
            this.emit('commandCall', ResolvedInteraction, this.client);
        });
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    updateCache(...commands) {
        commands.forEach(command => this.cache.set(command.id, command));
        return this.cache;
    }
    /**
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand[]>}
     */
    async fetchAll(guildID) {
        if (!this.application)
            this.application = await this.client.fetchApplication();
        const res = guildID ?
            await this.client.discord.applications(this.application.id).guilds(guildID).commands.get() :
            await this.client.discord.applications(this.application.id).commands.get();
        const commands = res ? [...await res.json()].map(command => new SlashCommand_js_1.SlashCommand(this.client, { guildID, ...command })) : [];
        this.updateCache(...commands);
        return commands;
    }
    /**
     *
     * @param {string} id The ID of a slash command
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | null>}
     */
    async fetch(id, guildID) {
        if (!this.application)
            this.application = await this.client.fetchApplication();
        if (this.cache.has(id))
            return this.cache.get(id) ?? null;
        const res = guildID ?
            await this.client.discord.applications(this.application.id).guilds(guildID).commands(id).get() :
            await this.client.discord.applications(this.application.id).commands(id).get();
        const command = res ? new SlashCommand_js_1.SlashCommand(this.client, await res.json()) : null;
        if (command)
            this.updateCache(command);
        return command;
    }
    /**
     * Post a new slash command to Discord.
     *
     * If an existing command has the same name then the existing command will be returned.
     * @param {SlashCommand | SlashCommandOptions} command An instance of the slash command class or an object of type SlashCommandOptions
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | undefined>}
     */
    async post(command) {
        if (!this.application)
            this.application = await this.client.fetchApplication();
        if (!(command instanceof SlashCommand_js_1.default))
            return await this.post(new SlashCommand_js_1.default(command));
        await this.fetchAll(command.guildID);
        if (!command.name)
            throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description)
            throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');
        const existing = this.cache.array().find(existing => existing.name === command.name && existing.guildID === command.guildID);
        if (existing) {
            this.emit('commandCreate', existing);
            return existing;
        }
        let res = command.guildID ?
            await this.client.discord.applications(this.application.id).guilds(command.guildID).commands.post({ body: command.toJSON() }) :
            await this.client.discord.applications(this.application.id).commands.post({ body: command.toJSON() });
        if (!res)
            return;
        const posted = new SlashCommand_js_1.SlashCommand(this.client, { guildID: command.guildID, ...await res.json() });
        this.emit('commandCreate', posted);
        return this.updateCache(posted).get(posted.id);
    }
    async edit(command, details) {
        if (!this.application)
            this.application = await this.client.fetchApplication();
        if (!(command instanceof SlashCommand_js_1.SlashCommand))
            return;
        const res = command.guildID ?
            await this.client.discord.applications(this.application.id).guilds(command.guildID).commands(command.id).patch({ body: details }) :
            await this.client.discord.applications(this.application.id).commands(command.id).patch({ body: details });
        if (res.status !== 200)
            return;
        const edited = new SlashCommand_js_1.SlashCommand(this.client, await res.json());
        this.emit('commandUpdate', command, edited);
        return this.updateCache(edited).get(edited.id);
    }
    async delete(command) {
        if (!this.application)
            this.application = await this.client.fetchApplication();
        if (!(command instanceof SlashCommand_js_1.SlashCommand))
            return;
        const deleted = command.guildID ?
            await this.client.discord.applications(this.application.id).guilds(command.guildID).commands(command.id).delete() :
            await this.client.discord.applications(this.application.id).commands(command.id).delete();
        if (deleted.status !== 204)
            return;
        this.cache.delete(command.id);
        this.emit('commandDelete', command);
        return command;
    }
    /**
     * @param command An instance of SlashCommand or the ID of a slash command
     * @param callback The function to be called when the command is used
     */
    setCallback(command, callback) {
        const id = command instanceof SlashCommand_js_1.SlashCommand ? command.id : command;
        if (typeof callback !== 'function')
            return this;
        this.callbacks.set(id, callback);
        return this;
    }
}
exports.default = SlashCommandIndex;
