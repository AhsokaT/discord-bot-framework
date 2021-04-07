"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionOptions = exports.InteractionOption = exports.Interaction = exports.InteractionInitialResponse = exports.InteractionResponseType = void 0;
const SlashTypes_js_1 = require("./SlashTypes.js");
const InteractionMessage_js_1 = require("./InteractionMessage.js");
const APIInteractionMessage_js_1 = require("./APIInteractionMessage.js");
var InteractionResponseType;
(function (InteractionResponseType) {
    InteractionResponseType[InteractionResponseType["Acknowledge"] = 2] = "Acknowledge";
    InteractionResponseType[InteractionResponseType["ChannelMessage"] = 3] = "ChannelMessage";
    InteractionResponseType[InteractionResponseType["ChannelMessageWithSource"] = 4] = "ChannelMessageWithSource";
    InteractionResponseType[InteractionResponseType["DefferedChannelMessageWithSource"] = 5] = "DefferedChannelMessageWithSource";
})(InteractionResponseType = exports.InteractionResponseType || (exports.InteractionResponseType = {}));
// export class APIInteractionMessage {
//     public content?: string | MessageEmbed;
//     public tts: boolean;
//     public embeds: MessageEmbed[];
//     public allowedMentions: AllowedMentions;
//     constructor(content?: string | MessageEmbed, options: InteractionMessageOptions = {}) {
//         if (content) this.content = content;
//         const { tts, embeds, allowedMentions } = options;
//         this.tts = Boolean(tts);
//         this.embeds = embeds ?? [];
//         this.allowedMentions = allowedMentions ?? {};
//     }
//     public construct(): any {
//         let obj: any = {
//             data: {
//                 tts: this.tts,
//                 embeds: this.embeds.map(embed => embed.toJSON()),
//                 allowed_mentions: this.allowedMentions
//             }
//         };
//         if (typeof this.content === 'string') obj.data.content = this.content;
//         if (this.content instanceof MessageEmbed) obj.data.embeds.push(this.content.toJSON());
//         if (this instanceof APIInteractionInitialResponse) {
//             obj.type = InteractionResponseType[this.type];
//             if (this.ephemeral) obj.data.flags = 64;
//         }
//         return obj;
//     }
// }
// export class APIInteractionInitialResponse extends APIInteractionMessage {
//     public ephemeral: boolean;
//     public type: InteractionResponseTypeString;
//     constructor(content?: string | MessageEmbed, options: InteractionInitialResponseOptions = {}) {
//         super(content, options);
//         this.type = options.type ?? 'ChannelMessageWithSource';
//         this.ephemeral = Boolean(options.ephemeral);
//     }
// }
class InteractionInitialResponse {
    constructor(client, appID, token, content, options = {}) {
        if (content)
            this.content = content;
        this.client = client;
        this.appID = appID;
        this.token = token;
        const { tts, embeds, allowedMentions, type, ephemeral } = options;
        this.tts = Boolean(tts);
        this.embeds = embeds ?? [];
        this.allowedMentions = allowedMentions ?? {};
        this.type = type ?? 'ChannelMessageWithSource';
        this.ephemeral = Boolean(ephemeral);
    }
    async delete() {
        await this.client.discord.webhooks(this.appID, this.token).messages('@original').delete();
        return this;
    }
    async edit(content, options = {}) {
        const message = new APIInteractionMessage_js_1.APIInteractionResponse({ content, ...options }).resolve();
        console.log(await this.client.discord.webhooks(this.appID, this.token).messages('@original').patch({ body: message }));
    }
}
exports.InteractionInitialResponse = InteractionInitialResponse;
class Interaction {
    constructor(client, channel, member, id, token, appID, options) {
        this.hasReplied = false;
        this.id = id;
        this.token = token;
        this.appID = appID;
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
        const data = new APIInteractionMessage_js_1.APIInteractionResponse({ content, ...options }).resolve();
        await this.client.discord.interactions(this.id, this.token).callback.post({ body: data });
        return new InteractionMessage_js_1.InitialInteractionMessage(this.client, this.appID, this.token, { ...options, content });
    }
}
exports.Interaction = Interaction;
class InteractionOption {
    constructor(options) {
        const { name, value, type, options: opts } = options;
        this.name = name;
        this.value = value;
        this.type = SlashTypes_js_1.ApplicationCommandOptionType[type];
        if (opts)
            this.options = opts.map(opt => new InteractionOption(opt));
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
