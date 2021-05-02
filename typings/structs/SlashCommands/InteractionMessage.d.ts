import { MessageEmbed } from 'discord.js';
import Client from '../../client/Client.js';
import { InteractionResponseTypeString } from './Interaction.js';
import { InteractionMessageOptions, AllowedMentions } from './APIInteractionMessage.js';
interface InteractionInitialResponseOptions extends InteractionMessageOptions {
    type?: InteractionResponseTypeString;
    ephemeral?: boolean;
}
export declare class InteractionMessage {
    private client;
    content?: string;
    tts: boolean;
    embeds: MessageEmbed[];
    allowedMentions: AllowedMentions;
    id?: string;
    applicationID: string;
    token: string;
    constructor(client: Client, applicationID: string, token: string, data?: InteractionMessageOptions & {
        content?: string | MessageEmbed;
    }, id?: string);
    delete(): Promise<InteractionMessage | undefined>;
    edit(content?: string | MessageEmbed, options?: InteractionMessageOptions): Promise<InteractionMessage>;
}
export declare class InitialInteractionMessage extends InteractionMessage {
    ephemeral: boolean;
    type: InteractionResponseTypeString;
    constructor(client: Client, applicationID: string, token: string, data?: InteractionInitialResponseOptions & {
        content?: string | MessageEmbed;
    });
}
export {};
