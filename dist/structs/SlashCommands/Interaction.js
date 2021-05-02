"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = exports.InteractionResponseType = void 0;
const InteractionMessage_js_1 = require("./InteractionMessage.js");
const APIInteractionMessage_js_1 = require("./APIInteractionMessage.js");
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["DefferedChannelMessageWithSource"] = 5] = "DefferedChannelMessageWithSource";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
class Interaction {
    constructor(details) {
        this.hasReplied = false;
        this.id = details.id;
        this.token = details.token;
        this.command = details.command;
        this.application = details.application;
        this.client = details.client;
        this.member = details.member;
        this.channel = details.channel;
        this.options = details.options;
        this.guild = details.member?.guild;
        this.author = details.member?.user;
        this.guildID = details.guildID;
    }
    async reply(content, options) {
        if (this.hasReplied)
            throw new Error('You can only reply to a slash command once; to send followup messages, use \'interaction.channel.send();\'');
        this.hasReplied = true;
        const data = new APIInteractionMessage_js_1.APIInteractionResponse({ content, ...options }).resolve();
        await this.client.discord.interactions(this.id, this.token).callback.post({ body: data });
        return new InteractionMessage_js_1.InitialInteractionMessage(this.client, this.application.id, this.token, { content, ...options });
    }
}
exports.Interaction = Interaction;
