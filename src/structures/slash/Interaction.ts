import { ApplicationCommandOptionType } from './SlashTypes.js';
import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User, APIMessage } from 'discord.js';
import { Client } from '../client/Client.js';
import { InteractionMessage, InitialInteractionMessage } from './InteractionMessage.js';
import { APIInteractionMessage, APIInteractionResponse } from './APIInteractionMessage.js';

interface AllowedMentions {
    parse?: ('users' | 'everyone' | 'roles')[],
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

export enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

export type InteractionResponseTypeString = keyof typeof InteractionResponseType;

// export class APIInteractionMessage {
//     public content?: string | MessageEmbed;
//     public tts: boolean;
//     public embeds: MessageEmbed[];
//     public allowedMentions: AllowedMentions;

//     constructor(content?: string | MessageEmbed, options: InteractionMessageOptions = {}) {
//         if (content) this.content = content;

//         const { tts, embeds, allowedMentions } = options;

//         this.tts = Boolean(tts);
//         this.embeds = embeds ?? [];
//         this.allowedMentions = allowedMentions ?? {};
//     }

//     public construct(): any {
//         let obj: any = {
//             data: {
//                 tts: this.tts,
//                 embeds: this.embeds.map(embed => embed.toJSON()),
//                 allowed_mentions: this.allowedMentions
//             }
//         };

//         if (typeof this.content === 'string') obj.data.content = this.content;
//         if (this.content instanceof MessageEmbed) obj.data.embeds.push(this.content.toJSON());

//         if (this instanceof APIInteractionInitialResponse) {
//             obj.type = InteractionResponseType[this.type];
//             if (this.ephemeral) obj.data.flags = 64;
//         }

//         return obj;
//     }
// }

// export class APIInteractionInitialResponse extends APIInteractionMessage {
//     public ephemeral: boolean;
//     public type: InteractionResponseTypeString;

//     constructor(content?: string | MessageEmbed, options: InteractionInitialResponseOptions = {}) {
//         super(content, options);

//         this.type = options.type ?? 'ChannelMessageWithSource';
//         this.ephemeral = Boolean(options.ephemeral);
//     }
// }

export class InteractionInitialResponse implements InteractionInitialResponseOptions {
    public content?: string | MessageEmbed;
    public tts: boolean;
    public embeds: MessageEmbed[];
    public allowedMentions: AllowedMentions;
    public ephemeral: boolean;
    public type: InteractionResponseTypeString;

    public appID: string;
    public token: string;

    private client: Client;

    constructor(client: Client, appID: string, token: string, content?: string | MessageEmbed, options: InteractionInitialResponseOptions = {}) {
        if (content) this.content = content;

        this.client = client;
        this.appID = appID;
        this.token = token;

        const { tts, embeds, allowedMentions, type, ephemeral } = options;

        this.tts = Boolean(tts);
        this.embeds = embeds ?? [];
        this.allowedMentions = allowedMentions ?? {};
        this.type = type ?? 'ChannelMessageWithSource';
        this.ephemeral = Boolean(ephemeral);
    }

    public async delete() {
        await this.client.discord.webhooks(this.appID, this.token).messages('@original').delete();
        return this;
    }

    public async edit(content?: string | MessageEmbed, options: Omit<InteractionInitialResponseOptions, 'type' | 'tts'> = {}) {
        const message = new APIInteractionResponse({ content, ...options }).resolve();

        console.log(await this.client.discord.webhooks(this.appID, this.token).messages('@original').patch({ body: message }));
    }
}

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

    public async reply(content?: string | MessageEmbed, options?: InteractionInitialResponseOptions) {
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