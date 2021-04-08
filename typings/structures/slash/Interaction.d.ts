import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import { Client } from '../client/Client.js';
import { InitialInteractionMessage } from './InteractionMessage.js';
import { InteractionResponseOptions } from './APIInteractionMessage.js';
export declare enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage = 3,
    ChannelMessageWithSource = 4,
    DefferedChannelMessageWithSource = 5
}
export declare type InteractionResponseTypeString = keyof typeof InteractionResponseType;
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
    reply(content?: string | MessageEmbed, options?: InteractionResponseOptions): Promise<InitialInteractionMessage>;
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
