import { SlashCommand } from './Slash.js';
import { ApplicationCommandOptionType, Snowflake } from './SlashTypes.js';
import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel, User } from 'discord.js';
import { Client } from '../client/Client.js';

export class SlashBase {
    #client: Client;
    #applicationID: string;
    #commands: SlashCommand[] = [];
    #guildID: string | undefined;

    constructor(client: Client) {
        this.#client = client;

        // @ts-expect-error
        client.ws.on('INTERACTION_CREATE', async i => {
            const channel = await this.#client.channels.fetch(i.channel_id).catch(console.error);
            if (!channel || !(channel instanceof TextChannel || channel instanceof NewsChannel)) return;

            const member = await channel.guild.members.fetch(i.member.user.id).catch(console.error);
            if (!member) return;

            const command = this.#commands.find(command => command.name === i.data.name);

            if (command && command.callback) command.callback(new InteractionResponse(this.#client, channel, member, i.id, i.token, new InteractionOptions(i.data.options?.map(i => new InteractionOption(i)))), this.#client);
        });
    }

    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    public guild(id: Snowflake): SlashBase {
        if (typeof id === 'string') this.#guildID = id;

        return this;
    }

    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    public global(): SlashBase {
        this.#guildID = undefined;

        return this;
    }

    /**
     * @returns an array of your slash commands.
     */
    public async all(): Promise<SlashCommand[]> {
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        const commands = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.get() :
        await this.#client.discord.applications(this.#applicationID).commands.get();

        return commands ? commands.map(command => new SlashCommand(command)) : [];
    }

    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    public async post(command: SlashCommand): Promise<SlashCommand | undefined> {
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        if (!(command instanceof SlashCommand)) return;

        if (!command.name) throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description) throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');

        const existing = (await this.all()).find(cmd => cmd.name === command.name);

        if (existing) {
            if (typeof command.callback === 'function') existing.setCallback(command.callback);

            this.#commands.push(existing);

            return existing;
        }

        let posted = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands.post({ body: command.toJSON() }) :
        await this.#client.discord.applications(this.#applicationID).commands.post({ body: command.toJSON() });

        if (!posted) return;

        posted = new SlashCommand(posted);
        if (typeof command.callback === 'function') posted.setCallback(command.callback);

        this.#commands.push(posted);

        return posted;
    }

    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    public async delete(command: string): Promise<SlashCommand | undefined> {
        if (!this.#applicationID) this.#applicationID = (await this.#client.fetchApplication()).id;

        if (!command) throw new Error('You must provide the name or ID of a slash command.');

        const existing = (await this.all()).find(i => i.name === command || i.id === command);

        if (!existing) return;

        const deleted = this.#guildID ?
        await this.#client.discord.applications(this.#applicationID).guilds(this.#guildID).commands(existing.id).delete() :
        await this.#client.discord.applications(this.#applicationID).commands(existing.id).delete();

        if (deleted && deleted.status === 204) return existing;
    }
}

interface InteractionCallbackOptions {
    type?: InteractionResponseTypeString;
    embeds?: MessageEmbed[];
    ephemeral?: boolean;
    tts?: boolean;
    allowedMentions?: {
        parse?: ('users' | 'everyone' | 'roles')[],
        roles?: string[];
        users?: string[];
    }
}

enum InteractionResponseType {
    Acknowledge = 2,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

type InteractionResponseTypeString = keyof typeof InteractionResponseType;

export class InteractionResponse {
    private hasReplied = false;
    private client: Client;

    public id: string;
    public token: string;
    public channel: TextChannel | NewsChannel;
    public member: GuildMember;
    public guild: Guild;
    public options: InteractionOptions;
    public author: User;

    constructor(client: Client, channel: TextChannel | NewsChannel, member: GuildMember, id: string, token: string, options: InteractionOptions) {
        this.id = id;
        this.token = token;
        this.client = client;
        this.member = member;
        this.channel = channel;
        this.options = options;
        this.guild = member.guild;
        this.author = member.user;
    }

    public async reply(content?: string | MessageEmbed, options?: InteractionCallbackOptions) {
        if (this.hasReplied) throw new Error('You can only reply to a slash command once; to send followup messages, use \'interaction.channel.send();\'');

        this.hasReplied = true;

        if (!options) options = new Object();

        let json = {
            type: InteractionResponseType[options.type ?? 'ChannelMessageWithSource'],
            data: {
                content: typeof content === 'string' ? content : undefined,
                flags: options.ephemeral ? 64 : undefined,
                embeds: options.embeds?.map(i => i.toJSON()) ?? new Array(),
                allowed_mentions: options.allowedMentions ?? undefined
            }
        };

        if (content instanceof MessageEmbed) json.data.embeds.push(content.toJSON());

        await this.client.discord.interactions(this.id, this.token).callback.post({ body: json });
    }
}

export class InteractionOption {
    name: string;
    value: any;
    type: string;
    options?: InteractionOption[];

    constructor(options: { name: string, value: any, type: number, options?: InteractionOption[] }) {
        this.name = options.name;
        this.value = options.value;
        this.type = ApplicationCommandOptionType[options.type];
        if (options.options) this.options = options.options;
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