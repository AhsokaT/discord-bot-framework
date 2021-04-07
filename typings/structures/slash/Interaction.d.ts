import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import { Client } from '../client/Client.js';
import { InitialInteractionMessage } from './InteractionMessage.js';
interface AllowedMentions {
    parse?: ('users' | 'everyone' | 'roles')[];
    roles?: string[];
    users?: string[];
}
interface InteractionMessageOptions {
    embeds?: MessageEmbed[];
    tts?: boolean;
    allowedMentions?: AllowedMentions;
}
interface InteractionInitialResponseOptions extends InteractionMessageOptions {
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
export declare class InteractionInitialResponse implements InteractionInitialResponseOptions {
    content?: string | MessageEmbed;
    tts: boolean;
    embeds: MessageEmbed[];
    allowedMentions: AllowedMentions;
    ephemeral: boolean;
    type: InteractionResponseTypeString;
    appID: string;
    token: string;
    private client;
    constructor(client: Client, appID: string, token: string, content?: string | MessageEmbed, options?: InteractionInitialResponseOptions);
    delete(): Promise<this>;
    edit(content?: string | MessageEmbed, options?: Omit<InteractionInitialResponseOptions, 'type' | 'tts'>): Promise<void>;
}
export declare class Interaction {
    private hasReplied;
    private client;
    id: string;
    token: string;
    appID: string;
    channel: TextChannel | NewsChannel;
    member: GuildMember;
    guild: Guild;
    options: InteractionOptions;
    author: User;
    constructor(client: Client, channel: TextChannel | NewsChannel, member: GuildMember, id: string, token: string, appID: string, options: InteractionOptions);
    reply(content?: string | MessageEmbed, options?: InteractionInitialResponseOptions): Promise<InitialInteractionMessage>;
}
export declare class InteractionOption {
    name: string;
    value: any;
    type: string;
    options?: InteractionOption[];
    constructor(options: {
        name: string;
        value: any;
        type: number;
        options?: any[];
    });
}
export declare class InteractionOptions {
    private args;
    constructor(args?: InteractionOption[]);
    /**
     * @param name Name of your parameter
     * @returns The user input
     */
    get(name: string): any;
    /**
     * @returns The first user input
     */
    first(): any;
    all(): InteractionOption[];
}
export {};
