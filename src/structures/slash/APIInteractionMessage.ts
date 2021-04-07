import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export interface AllowedMentions {
    parse?: ('users' | 'everyone' | 'roles')[],
    roles?: string[];
    users?: string[];
}

type ResolvedEmbed = {
    [index in (keyof MessageEmbedOptions)]: Exclude<MessageEmbedOptions[index], undefined> | null;
}

export type InteractionMessageContent = string | MessageEmbed;

export interface InteractionMessageOptions {
    content?: InteractionMessageContent;
    embeds?: MessageEmbed[];
    tts?: boolean;
    allowedMentions?: AllowedMentions;
}

export interface ResolvedInteractionMessage {
    flags?: number | null;
    content: string | null;
    embeds: object[];
    tts: boolean;
    allowed_mentions: AllowedMentions;
}

export interface ResolvedInteractionResponse {
    type?: InteractionResponseType;
    data?: ResolvedInteractionMessage;
}

export interface InteractionResponseOptions extends InteractionMessageOptions {
    type?: InteractionResponseTypeString;
    ephemeral?: boolean;
}

export enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

export type InteractionResponseTypeString = keyof typeof InteractionResponseType;

export class APIInteractionMessage {
    public options: InteractionMessageOptions;

    constructor(options: InteractionMessageOptions = {}) {
        this.options = options;
    }

    public resolve(): ResolvedInteractionMessage {
        let { content, embeds = [], tts, allowedMentions = {} } = this.options;

        if (content instanceof MessageEmbed || typeof content === 'object') embeds.push(content);

        return {
            content: typeof content === 'string' ? content : null,
            embeds: embeds.map(embed => new MessageEmbed(embed).toJSON()),
            tts: Boolean(tts),
            allowed_mentions: allowedMentions
        };
    }
}

export class APIInteractionResponse {
    public options: InteractionResponseOptions;

    constructor(options: InteractionResponseOptions = {}) {
        this.options = options;
    }

    public resolve(): ResolvedInteractionResponse {
        const { ...data } = new APIInteractionMessage(this.options).resolve();

        return {
            type: InteractionResponseType[this.options.type ?? 'ChannelMessageWithSource'],
            data: {
                flags: this.options.ephemeral ? 64 : 0,
                ...data
            }
        }
    }
}