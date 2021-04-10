import { MessageEmbed, MessageEmbedOptions } from 'discord.js';

export enum InteractionMessageFlags {
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
    EPHEMERAL = 64
}

export type InteractionMessageFlagsString = keyof typeof InteractionMessageFlags;

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
    flags?: InteractionMessageFlagsString | number | null;
    content?: InteractionMessageContent;
    embeds?: MessageEmbed[];
    tts?: boolean;
    allowedMentions?: AllowedMentions;
}

export interface ResolvedInteractionMessage {
    flags: InteractionMessageFlags | number | null;
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
        let { content, embeds = [], tts, allowedMentions = {}, flags } = this.options;

        if (content instanceof MessageEmbed || typeof content === 'object') embeds.push(content);

        return {
            content: typeof content === 'string' ? content : null,
            embeds: embeds.map(embed => new MessageEmbed(embed).toJSON()),
            tts: Boolean(tts),
            flags: InteractionMessageFlags[flags ?? ''] ?? 0,
            allowed_mentions: allowedMentions
        }
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
            data
        }
    }
}