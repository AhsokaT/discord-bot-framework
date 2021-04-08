"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialInteractionMessage = exports.InteractionMessage = void 0;
const discord_js_1 = require("discord.js");
const APIInteractionMessage_js_1 = require("./APIInteractionMessage.js");
class InteractionMessage {
    constructor(client, applicationID, token, data = {}, id) {
        this.client = client;
        this.token = token;
        this.applicationID = applicationID;
        if (id)
            this.id = id;
        const { tts, embeds, allowedMentions, content } = data;
        this.tts = Boolean(tts);
        this.embeds = embeds ?? [];
        this.allowedMentions = allowedMentions ?? {};
        if (typeof content === 'string')
            this.content = content;
        if (content instanceof discord_js_1.MessageEmbed)
            this.embeds.push(content);
    }
    async delete() {
        const res = this.id ?
            await this.client.discord.webhooks(this.applicationID, this.token).messages(this.id).delete() :
            await this.client.discord.webhooks(this.applicationID, this.token).messages('@original').delete();
        if (res.status === 204)
            return this;
    }
    async edit(content, options = {}) {
        const message = new APIInteractionMessage_js_1.APIInteractionMessage({ content, ...options });
        const res = this.id ?
            await this.client.discord.webhooks(this.applicationID, this.token).messages(this.id).patch({ body: message.resolve() }) :
            await this.client.discord.webhooks(this.applicationID, this.token).messages('@original').patch({ body: message.resolve() });
        return this;
    }
}
exports.InteractionMessage = InteractionMessage;
class InitialInteractionMessage extends InteractionMessage {
    constructor(client, applicationID, token, data = {}) {
        super(client, applicationID, token, data);
        const { ephemeral, type } = data;
        this.ephemeral = Boolean(ephemeral);
        if (type)
            this.type = type;
    }
}
exports.InitialInteractionMessage = InitialInteractionMessage;
