import { SlashCommand } from './Slash.js';
import { Snowflake } from './SlashTypes.js';
import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import { Client } from '../client/Client.js';
export declare class SlashBase {
    #private;
    constructor(client: Client);
    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    guild(id: Snowflake): SlashBase;
    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    global(): SlashBase;
    /**
     * @returns an array of your slash commands.
     */
    all(): Promise<SlashCommand[]>;
    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    post(command: SlashCommand): Promise<SlashCommand | undefined>;
    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    delete(command: string): Promise<SlashCommand | undefined>;
}
interface InteractionCallbackOptions {
    type?: InteractionResponseTypeString;
    embeds?: MessageEmbed[];
    ephemeral?: boolean;
    tts?: boolean;
    allowedMentions?: {
        parse?: ('users' | 'everyone' | 'roles')[];
        roles?: string[];
        users?: string[];
    };
}
declare enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage = 3,
    ChannelMessageWithSource = 4,
    DefferedChannelMessageWithSource = 5
}
declare type InteractionResponseTypeString = keyof typeof InteractionResponseType;
export declare class InteractionResponse {
    private hasReplied;
    private client;
    id: string;
    token: string;
    channel: TextChannel | NewsChannel;
    member: GuildMember;
    guild: Guild;
    options: InteractionOptions;
    author: User;
    constructor(client: Client, channel: TextChannel | NewsChannel, member: GuildMember, id: string, token: string, options: InteractionOptions);
    reply(content?: string | MessageEmbed, options?: InteractionCallbackOptions): Promise<void>;
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
        options?: InteractionOption[];
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
