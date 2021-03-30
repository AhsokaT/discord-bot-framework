import { SlashCommand } from './Slash.js';
import { post, del, get, patch } from 'superagent';
import { SlashCallback, Snowflake, SlashArgument, SlashArguments } from './SlashTypes.js';
import { Guild, GuildMember, MessageEmbed, NewsChannel, TextChannel } from 'discord.js';
import { Client } from '../client/Client.js';

export class SlashBase {
    #token: string;
    #client: Client;
    #appID?: string;
    #guildID?: string;
    #callbacks: { name: string; callback: SlashCallback; }[] = [];

    constructor(client: Client, token: string) {
        this.#client = client;
        this.#token = token;

        // @ts-expect-error
        client.ws.on('INTERACTION_CREATE', async i => {
            const channel = await this.#client.channels.fetch(i.channel_id).catch(console.error);
            if (!channel || !(channel instanceof TextChannel || channel instanceof NewsChannel)) return;

            const member = await channel.guild.members.fetch(i.member.user.id);
            if (!member) return;

            const command = this.#callbacks.find(callback => callback.name === i.data.name);

            if (command) command.callback(new InteractionResponse(channel, member, i.id, i.token, new SlashArguments(i.data.options?.map(i => new SlashArgument(i)))), this.#client);
        });
    }

    private async endpoint(): Promise<string> {
        if (!this.#appID) this.#appID = (await this.#client.fetchApplication()).id;

        return `https://discord.com/api/v8/applications/${this.#appID}/${this.#guildID ? `guilds/${this.#guildID}/commands` : 'commands'}`;
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
        const endpoint = await this.endpoint();

        const res = await get(endpoint).set('Authorization', 'Bot ' + this.#token).catch(console.error);

        return res ? res.body.map(i => new SlashCommand(i)) : [];
    }

    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    public async post(command: SlashCommand): Promise<SlashCommand | undefined> {
        const endpoint = await this.endpoint();

        if (!(command instanceof SlashCommand)) return;

        if (!command.name) throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description) throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');

        const postedCommand = await post(endpoint).send(command.toJSON()).set('Content-Type', 'application/json').set('Authorization', 'Bot ' + this.#token).catch(console.error);

        if (!postedCommand) return;

        const posted = new SlashCommand(postedCommand.body);

        if (posted.name && command.callback) this.#callbacks.push({
            name: posted.name,
            callback: command.callback
        });

        return posted;
    }

    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    public async delete(command: string): Promise<SlashCommand | undefined> {
        if (!command) throw new Error('You must provide the name or ID of a slash command.');
        const endpoint = await this.endpoint();

        const toDelete = (await this.all()).find(i => i.name === command || i.id === command);

        if (!toDelete) return;

        const deleted = await del(endpoint + `/${toDelete.id}`).set('Authorization', 'Bot ' + this.#token).catch(console.error);

        if (deleted && deleted.status === 204) return toDelete;
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
    Pong = 1,
    Acknowledge,
    ChannelMessage,
    ChannelMessageWithSource,
    DefferedChannelMessageWithSource
}

type InteractionResponseTypeString = keyof typeof InteractionResponseType;

export class InteractionResponse {
    private id: string;
    private token: string;
    private hasReplied = false;

    public channel: TextChannel | NewsChannel;
    public member: GuildMember;
    public guild: Guild;
    public arguments: SlashArguments;

    constructor(channel: TextChannel | NewsChannel, member: GuildMember, id: string, token: string, args: SlashArguments) {
        this.id = id;
        this.token = token;
        this.member = member;
        this.channel = channel;
        this.arguments = args;
    }

    public async reply(content?: string, options?: InteractionCallbackOptions) {
        if (this.hasReplied) throw new Error('You can only reply to a slash command once.');

        this.hasReplied = true;

        const endpoint = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

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

        await post(endpoint).set('Content-Type', 'application/json').send(JSON.stringify(json));
    }
}