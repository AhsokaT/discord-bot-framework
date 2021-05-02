import { ApplicationCommandOptionType, SlashCommand } from './SlashCommand.js';
import { ClientApplication, Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import Client from '../../client/Client.js';
import { InitialInteractionMessage } from './InteractionMessage.js';
import { APIInteractionResponse, InteractionResponseOptions } from './APIInteractionMessage.js';
import { Index } from '../../util/extensions.js';

export enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

export type InteractionResponseTypeString = keyof typeof InteractionResponseType;

interface InteractionOptions {
    guildID: string;
    command: SlashCommand;
    client: Client;
    channel?: TextChannel | NewsChannel;
    member?: GuildMember;
    id: string; token: string;
    application: ClientApplication; 
    options: Index<string, any>;
}

export class Interaction {
    private hasReplied = false;
    private client: Client;

    public guildID: string;
    public id: string;
    public token: string;
    public application: ClientApplication;
    public channel?: TextChannel | NewsChannel;
    public member?: GuildMember;
    public guild?: Guild;
    public options: Index<string, any>;
    public author?: User;
    public command: SlashCommand;

    constructor(details: InteractionOptions) {
        this.id = details.id;
        this.token = details.token;
        this.command = details.command;
        this.application = details.application;
        this.client = details.client;
        this.member = details.member;
        this.channel = details.channel;
        this.options = details.options;
        this.guild = details.member?.guild;
        this.author = details.member?.user;
        this.guildID = details.guildID;
    }

    public async reply(content?: string | MessageEmbed, options?: InteractionResponseOptions) {
        if (this.hasReplied) throw new Error('You can only reply to a slash command once; to send followup messages, use \'interaction.channel.send();\'');

        this.hasReplied = true;

        const data = new APIInteractionResponse({ content, ...options }).resolve();

        await this.client.discord.interactions(this.id, this.token).callback.post({ body: data });

        return new InitialInteractionMessage(this.client, this.application.id, this.token, { content, ...options });
    }
}