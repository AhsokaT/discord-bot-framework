"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIInteractionResponse = exports.APIInteractionMessage = exports.InteractionResponseType = exports.InteractionMessageFlags = void 0;
const discord_js_1 = require("discord.js");
var InteractionMessageFlags;
(function (InteractionMessageFlags) {
    InteractionMessageFlags[InteractionMessageFlags["CROSSPOSTED"] = 1] = "CROSSPOSTED";
    InteractionMessageFlags[InteractionMessageFlags["IS_CROSSPOST"] = 2] = "IS_CROSSPOST";
    InteractionMessageFlags[InteractionMessageFlags["SUPPRESS_EMBEDS"] = 4] = "SUPPRESS_EMBEDS";
    InteractionMessageFlags[InteractionMessageFlags["SOURCE_MESSAGE_DELETED"] = 8] = "SOURCE_MESSAGE_DELETED";
    InteractionMessageFlags[InteractionMessageFlags["URGENT"] = 16] = "URGENT";
    InteractionMessageFlags[InteractionMessageFlags["EPHEMERAL"] = 64] = "EPHEMERAL";
})(InteractionMessageFlags = exports.InteractionMessageFlags || (exports.InteractionMessageFlags = {}));
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["DefferedChannelMessageWithSource"] = 5] = "DefferedChannelMessageWithSource";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
class APIInteractionMessage {
    constructor(options = {}) {
        this.options = options;
    }
    resolve() {
        let { content, embeds = [], tts, allowedMentions = {}, flags } = this.options;
        if (content instanceof discord_js_1.MessageEmbed || typeof content === 'object')
            embeds.push(content);
        return {
            content: typeof content === 'string' ? content : null,
            embeds: embeds.map(embed => new discord_js_1.MessageEmbed(embed).toJSON()),
            tts: Boolean(tts),
            flags: InteractionMessageFlags[flags ?? ''] ?? 0,
            allowed_mentions: allowedMentions
        };
    }
}
exports.APIInteractionMessage = APIInteractionMessage;
class APIInteractionResponse {
    constructor(options = {}) {
        this.options = options;
    }
    resolve() {
        const { ...data } = new APIInteractionMessage(this.options).resolve();
        return {
            type: InteractionResponseType[this.options.type ?? 'ChannelMessageWithSource'],
            data
        };
    }
}
exports.APIInteractionResponse = APIInteractionResponse;
