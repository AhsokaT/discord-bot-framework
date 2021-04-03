"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionOptions = exports.InteractionOption = exports.InteractionResponse = exports.SlashBase = void 0;
const Slash_js_1 = require("./Slash.js");
const SlashTypes_js_1 = require("./SlashTypes.js");
const discord_js_1 = require("discord.js");
class SlashBase {
    constructor(client) {
        this.#commands = [];
        this.#client = client;
        // @ts-expect-error
        client.ws.on('INTERACTION_CREATE', async (i) => {
            const channel = await this.#client.channels.fetch(i.channel_id).catch(console.error);
            if (!channel || !(channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.NewsChannel))
                return;
            const member = await channel.guild.members.fetch(i.member.user.id).catch(console.error);
            if (!member)
                return;
            const command = this.#commands.find(command => command.name === i.data.name);
            if (command && command.callback)
                command.callback(new InteractionResponse(this.#client, channel, member, i.id, i.token, new InteractionOptions(i.data.options?.map(i => new InteractionOption(i)))), this.#client);
        });
    }
    #client;
    #applicationID;
    #commands;
    #guildID;
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
        if (!this.#applicationID)
            this.#applicationID = (await this.#client.fetchApplication()).id;
        const commands = this.#guildID ?
            await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.get() :
            await this.#client.discord.applications(this.#applicationID).commands.get();
        return commands ? (await commands.json()).map(command => new Slash_js_1.SlashCommand(command)) : [];
    }
    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    async post(command) {
        if (!this.#applicationID)
            this.#applicationID = (await this.#client.fetchApplication()).id;
        if (!(command instanceof Slash_js_1.SlashCommand))
            return;
        if (!command.name)
            throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description)
            throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');
        const existing = (await this.all()).find(cmd => cmd.name === command.name);
        if (existing) {
            if (typeof command.callback === 'function')
                existing.setCallback(command.callback);
            this.#commands.push(existing);
            return existing;
        }
        let posted = this.#guildID ?
            await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.post({ body: command.toJSON() }) :
            await this.#client.discord.applications(this.#applicationID).commands.post({ body: command.toJSON() });
        if (!posted)
            return;
        posted = new Slash_js_1.SlashCommand(await posted.json());
        if (typeof command.callback === 'function')
            posted.setCallback(command.callback);
        this.#commands.push(posted);
        return posted;
    }
    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    async delete(command) {
        if (!this.#applicationID)
            this.#applicationID = (await this.#client.fetchApplication()).id;
        if (!command)
            throw new Error('You must provide the name or ID of a slash command.');
        const existing = (await this.all()).find(i => i.name === command || i.id === command);
        if (!existing)
            return;
        const deleted = this.#guildID ?
            await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands(existing.id).delete() :
            await this.#client.discord.applications(this.#applicationID).commands(existing.id).delete();
        if (deleted && deleted.status === 204)
            return existing;
    }
}
exports.SlashBase = SlashBase;
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["DefferedChannelMessageWithSource"] = 5] = "DefferedChannelMessageWithSource";
})(InteractionResponseType || (InteractionResponseType = {}));
class InteractionResponse {
    constructor(client, channel, member, id, token, options) {
        this.hasReplied = false;
        this.id = id;
        this.token = token;
        this.client = client;
        this.member = member;
        this.channel = channel;
        this.options = options;
        this.guild = member.guild;
        this.author = member.user;
    }
    async reply(content, options) {
        if (this.hasReplied)
            throw new Error('You can only reply to a slash command once; to send followup messages, use \'interaction.channel.send();\'');
        this.hasReplied = true;
        if (!options)
            options = {};
        const { embeds, ephemeral, allowedMentions } = options;
        let json = {
            type: InteractionResponseType[options.type ?? 'ChannelMessageWithSource'],
            data: {}
        };
        if (ephemeral) {
            json.data.flags = 64;
        }
        if (typeof content === 'string') {
            json.data.content = content;
        }
        if (Array.isArray(embeds)) {
            json.data.embeds = embeds.map(embed => embed.toJSON());
        }
        if (allowedMentions) {
            json.data.allowed_mentions = allowedMentions;
        }
        if (content instanceof discord_js_1.MessageEmbed)
            json.data.embeds.push(content.toJSON());
        await this.client.discord.interactions(this.id, this.token).callback.post({ body: json });
    }
}
exports.InteractionResponse = InteractionResponse;
class InteractionOption {
    constructor(options) {
        this.name = options.name;
        this.value = options.value;
        this.type = SlashTypes_js_1.ApplicationCommandOptionType[options.type];
        if (options.options)
            this.options = options.options;
    }
}
exports.InteractionOption = InteractionOption;
class InteractionOptions {
    constructor(args) {
        this.args = [];
        if (Array.isArray(args))
            this.args = args;
    }
    /**
     * @param name Name of your parameter
     * @returns The user input
     */
    get(name) {
        return this.args.find(arg => arg.name === name)?.value;
    }
    /**
     * @returns The first user input
     */
    first() {
        return this.args[0]?.value;
    }
    all() {
        return this.args;
    }
}
exports.InteractionOptions = InteractionOptions;
