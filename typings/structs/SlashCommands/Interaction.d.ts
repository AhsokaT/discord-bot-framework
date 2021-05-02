import { SlashCommand } from './SlashCommand.js';
import { ClientApplication, Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import Client from '../../client/Client.js';
import { InitialInteractionMessage } from './InteractionMessage.js';
import { InteractionResponseOptions } from './APIInteractionMessage.js';
import { Index } from '../../util/extensions.js';
export declare enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage = 3,
    ChannelMessageWithSource = 4,
    DefferedChannelMessageWithSource = 5
}
export declare type InteractionResponseTypeString = keyof typeof InteractionResponseType;
interface InteractionOptions {
    guildID: string;
    command: SlashCommand;
    client: Client;
    channel?: TextChannel | NewsChannel;
    member?: GuildMember;
    id: string;
    token: string;
    application: ClientApplication;
    options: Index<string, any>;
}
export declare class Interaction {
    private hasReplied;
    private client;
    guildID: string;
    id: string;
    token: string;
    application: ClientApplication;
    channel?: TextChannel | NewsChannel;
    member?: GuildMember;
    guild?: Guild;
    options: Index<string, any>;
    author?: User;
    command: SlashCommand;
    constructor(details: InteractionOptions);
    reply(content?: string | MessageEmbed, options?: InteractionResponseOptions): Promise<InitialInteractionMessage>;
}
export {};
