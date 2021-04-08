"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionOptions = exports.InteractionOption = exports.Interaction = exports.InteractionResponseType = void 0;
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
