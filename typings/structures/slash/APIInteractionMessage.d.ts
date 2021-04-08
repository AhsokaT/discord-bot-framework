import { MessageEmbed } from 'discord.js';
export declare enum InteractionMessageFlags {
    CROSSPOSTED = 1,
    IS_CROSSPOST = 2,
    SUPPRESS_EMBEDS = 4,
    SOURCE_MESSAGE_DELETED = 8,
    URGENT = 16,
    EPHEMERAL = 64
}
export declare type InteractionMessageFlagsString = keyof typeof InteractionMessageFlags;
export interface AllowedMentions {
    parse?: ('users' | 'everyone' | 'roles')[];
    roles?: string[];
    users?: string[];
}
export declare type InteractionMessageContent = string | MessageEmbed;
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
export declare enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage = 3,
    ChannelMessageWithSource = 4,
    DefferedChannelMessageWithSource = 5
}
export declare type InteractionResponseTypeString = keyof typeof InteractionResponseType;
export declare class APIInteractionMessage {
    options: InteractionMessageOptions;
    constructor(options?: InteractionMessageOptions);
    resolve(): ResolvedInteractionMessage;
}
export declare class APIInteractionResponse {
    options: InteractionResponseOptions;
    constructor(options?: InteractionResponseOptions);
    resolve(): ResolvedInteractionResponse;
}
