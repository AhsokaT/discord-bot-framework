import { MessageEmbed } from 'discord.js';
import Client from '../../client/Client.js';
import { InteractionResponseTypeString } from './Interaction.js';

import { APIInteractionMessage, InteractionMessageOptions, AllowedMentions } from './APIInteractionMessage.js';

interface InteractionInitialResponseOptions extends InteractionMessageOptions {
    type?: InteractionResponseTypeString;
    ephemeral?: boolean;
}

export class InteractionMessage {
    private client: Client;

    public content?: string;
    public tts: boolean;
    public embeds: MessageEmbed[];
    public allowedMentions: AllowedMentions;

    public id?: string;
    public applicationID: string;
    public token: string;

    constructor(client: Client, applicationID: string, token: string, data: InteractionMessageOptions & { content?: string | MessageEmbed } = {}, id?: string) {
        this.client = client;        

        this.token = token;
        this.applicationID = applicationID;
        if (id) this.id = id;

        const { tts, embeds, allowedMentions, content } = data;

        this.tts = Boolean(tts);
        this.embeds = embeds ?? [];
        this.allowedMentions = allowedMentions ?? {};
        if (typeof content === 'string') this.content = content;
        if (content instanceof MessageEmbed) this.embeds.push(content);
    }

    public async delete(): Promise<InteractionMessage | undefined> {
        const res = this.id ?
        await this.client.discord.webhooks(this.applicationID, this.token).messages(this.id).delete() :
        await this.client.discord.webhooks(this.applicationID, this.token).messages('@original').delete();

        if (res.status === 204) return this;
    }

    public async edit(content?: string | MessageEmbed, options: InteractionMessageOptions = {}): Promise<InteractionMessage> {
        const message = new APIInteractionMessage({ content, ...options });

        const res = this.id ?
        await this.client.discord.webhooks(this.applicationID, this.token).messages(this.id).patch({ body: message.resolve() }) :
        await this.client.discord.webhooks(this.applicationID, this.token).messages('@original').patch({ body: message.resolve() });

        return this;
    }
}

export class InitialInteractionMessage extends InteractionMessage {
    public ephemeral: boolean;
    public type: InteractionResponseTypeString;

    constructor(client: Client, applicationID: string, token: string, data: InteractionInitialResponseOptions & { content?: string | MessageEmbed } = {}) {
        super(client, applicationID, token, data);

        const { ephemeral, type } = data;

        this.ephemeral = Boolean(ephemeral);

        if (type) this.type = type;
    }
}