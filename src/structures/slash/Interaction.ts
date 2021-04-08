import { ApplicationCommandOptionType } from './SlashTypes.js';
import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import { Client } from '../client/Client.js';
import { InteractionMessage, InitialInteractionMessage } from './InteractionMessage.js';
import { APIInteractionMessage, APIInteractionResponse, InteractionResponseOptions } from './APIInteractionMessage.js';

export enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

export type InteractionResponseTypeString = keyof typeof InteractionResponseType;


export class Interaction {
    private hasReplied = false;
    private client: Client;

    public id: string;
    public token: string;
    public appID: string;
    public channel: TextChannel | NewsChannel;
    public member: GuildMember;
    public guild: Guild;
    public options: InteractionOptions;
    public author: User;

    constructor(client: Client, channel: TextChannel | NewsChannel, member: GuildMember, id: string, token: string, appID: string, options: InteractionOptions) {
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

    public async reply(content?: string | MessageEmbed, options?: InteractionResponseOptions) {
        if (this.hasReplied) throw new Error('You can only reply to a slash command once; to send followup messages, use \'interaction.channel.send();\'');

        this.hasReplied = true;

        const data = new APIInteractionResponse({ content, ...options }).resolve();

        await this.client.discord.interactions(this.id, this.token).callback.post({ body: data });

        return new InitialInteractionMessage(this.client, this.appID, this.token, { ...options, content });
    }
}

export class InteractionOption {
    name: string;
    value: any;
    type: string;
    options?: InteractionOption[];

    constructor(options: { name: string, value: any, type: number, options?: any[] }) {
        const { name, value, type, options: opts } = options;
        this.name = name;
        this.value = value;
        this.type = ApplicationCommandOptionType[type];
        if (opts) this.options = opts.map(opt => new InteractionOption(opt));
    }
}

export class InteractionOptions {
    private args: InteractionOption[] = [];

    constructor(args?: InteractionOption[]) {
        if (Array.isArray(args)) this.args = args;
    }

    /**
     * @param name Name of your parameter
     * @returns The user input
     */
    public get(name: string) {
        return this.args.find(arg => arg.name === name)?.value;
    }

    /**
     * @returns The first user input
     */
    public first() {
        return this.args[0]?.value;
    }

    public all() {
        return this.args;
    }
}