import { MessageEmbed } from 'discord.js';
export interface AllowedMentions {
    parse?: ('users' | 'everyone' | 'roles')[];
    roles?: string[];
    users?: string[];
}
export declare type InteractionMessageContent = string | MessageEmbed;
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
