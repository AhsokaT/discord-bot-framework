"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionResponse = exports.SlashBase = void 0;
const Slash_js_1 = require("./Slash.js");
const superagent_1 = require("superagent");
const SlashTypes_js_1 = require("./SlashTypes.js");
const discord_js_1 = require("discord.js");
class SlashBase {
    constructor(client, token) {
        this.#callbacks = [];
        this.#client = client;
        this.#token = token;
        // @ts-expect-error
        client.ws.on('INTERACTION_CREATE', async (i) => {
            const channel = await this.#client.channels.fetch(i.channel_id).catch(console.error);
            if (!channel || !(channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel))
                return;
            const member = await channel.guild.members.fetch(i.member.user.id);
            if (!member)
                return;
            const command = this.#callbacks.find(callback => callback.name === i.data.name);
            if (command)
                command.callback(new InteractionResponse(channel, member, i.id, i.token, new SlashTypes_js_1.SlashArguments(i.data.options?.map(i => new SlashTypes_js_1.SlashArgument(i)))), this.#client);
        });
    }
    #token;
    #client;
    #appID;
    #guildID;
    #callbacks;
    async endpoint() {
        if (!this.#appID)
            this.#appID = (await this.#client.fetchApplication()).id;
        return `https://discord.com/api/v8/applications/${this.#appID}/${this.#guildID ? `guilds/${this.#guildID}/commands` : 'commands'}`;
    }
    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    guild(id) {
        if (typeof id === 'string')
            this.#guildID = id;
        return this;
    }
    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    global() {
        this.#guildID = undefined;
        return this;
    }
    /**
     * @returns an array of your slash commands.
     */
    async all() {
        const endpoint = await this.endpoint();
        const res = await superagent_1.get(endpoint).set('Authorization', 'Bot ' + this.#token).catch(console.error);
        return res ? res.body.map(i => new Slash_js_1.SlashCommand(i)) : [];
    }
    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    async post(command) {
        const endpoint = await this.endpoint();
        if (!(command instanceof Slash_js_1.SlashCommand))
            return;
        if (!command.name)
            throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description)
            throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');
        const postedCommand = await superagent_1.post(endpoint).send(command.toJSON()).set('Content-Type', 'application/json').set('Authorization', 'Bot ' + this.#token).catch(console.error);
        if (!postedCommand)
            return;
        const posted = new Slash_js_1.SlashCommand(postedCommand.body);
        if (posted.name && command.callback)
            this.#callbacks.push({
                name: posted.name,
                callback: command.callback
            });
        return posted;
    }
    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    async delete(command) {
        if (!command)
            throw new Error('You must provide the name or ID of a slash command.');
        const endpoint = await this.endpoint();
        const toDelete = (await this.all()).find(i => i.name === command || i.id === command);
        if (!toDelete)
            return;
        const deleted = await superagent_1.del(endpoint + `/${toDelete.id}`).set('Authorization', 'Bot ' + this.#token).catch(console.error);
        if (deleted && deleted.status === 204)
            return toDelete;
    }
}
exports.SlashBase = SlashBase;
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Pong"] = 1] = "Pong";
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["DefferedChannelMessageWithSource"] = 5] = "DefferedChannelMessageWithSource";
})(InteractionResponseType || (InteractionResponseType = {}));
class InteractionResponse {
    constructor(channel, member, id, token, args) {
        this.hasReplied = false;
        this.id = id;
        this.token = token;
        this.member = member;
        this.channel = channel;
        this.arguments = args;
    }
    async reply(content, options) {
        if (this.hasReplied)
            throw new Error('You can only reply to a slash command once.');
        this.hasReplied = true;
        const endpoint = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;
        if (!options)
            options = new Object();
        let json = {
            type: InteractionResponseType[options.type ?? 'ChannelMessageWithSource'],
            data: {
                content: typeof content === 'string' ? content : undefined,
                flags: options.ephemeral ? 64 : undefined,
                embeds: options.embeds?.map(i => i.toJSON()) ?? new Array(),
                allowed_mentions: options.allowedMentions ?? undefined
            }
        };
        await superagent_1.post(endpoint).set('Content-Type', 'application/json').send(JSON.stringify(json));
    }
}
exports.InteractionResponse = InteractionResponse;
