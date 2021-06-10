import { Client as DJSClient, ClientOptions as DJSClientOptions, Message, ClientEvents, MessageActionRow, MessageButton } from 'discord.js';
import CommandManager, { CommandManagerOptions } from '../structs/CommandManager.js';
import ApplicationCommandManager from '../structs/ApplicationCommandManager';
import { Index } from 'js-augmentations';
import * as util from '../util/util.js';

export interface ClientOptions extends DJSClientOptions, CommandManagerOptions {
    token?: string;
}

export default class Client extends DJSClient {
    public commands: CommandManager;
    public applicationCommands: ApplicationCommandManager;

    constructor(options: ClientOptions) {
        super(options);

        if (options.token)
            super.token = options.token;

        this.commands = new CommandManager(this, options);
        this.applicationCommands = new ApplicationCommandManager(this);
    }

    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    public on(event: string | symbol, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }

    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    public async parseMessage(message: Message): Promise<any> {
        if (message.channel.type === 'dm' && !this.channels.cache.has(message.channel.id)) {
            const channel = await this.channels.fetch(message.channel.id).catch(util.noop);

            if (channel && channel.isText())
                message.channel = channel;
        }

        if (message.author.bot && !this.commands.allowBots)
            return;

        if (!message.content.toLowerCase().startsWith(this.commands.prefix.toLowerCase()))
            return;

        const messageSegments = message.content.split(' ');
        const name = messageSegments.shift()?.slice(this.commands.prefix.length).toLowerCase();

        if (!name)
            return;

        const command = this.commands.index.get(name);

        if (!command)
            return;

        if (!command.isDMCommand() && message.channel.type === 'dm')
            return;

        if (command.nsfw && message.channel.type !== 'dm' && !message.channel.nsfw)
            return message.channel.send('❌ This command must be run in an **NSFW** channel');

        if (command.isGuildCommand() && !message.member?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ You require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (command.isGuildCommand() && !message.guild?.me?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ I require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (command.nsfw && message.channel.type === 'dm') {
            const question = await message.channel.send({
                content: 'This command is marked as **NSFW**, are you sure you want to run it?',
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomID('YES')
                            .setLabel('Run')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomID('NO')
                            .setLabel('Cancel')
                            .setStyle('SECONDARY')
                    )
                ]
            }).catch(console.error);

            if (!question)
                return;

            const response = await message.channel.awaitMessageComponentInteraction(i => i.user.id === message.author.id, 15000).catch(util.noop);

            if (!response)
                return message.channel.send('⏱️ **15s timeout** ❌ Command cancelled').catch(console.error);

            if (response.customID === 'NO')
                return response.reply('Command cancelled').catch(console.error);

            response.deferUpdate();

            question.delete().catch(util.noop);
        }

        let args: any = [];

        const parameters = command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0);

        for (const param of parameters) {
            let input: string | undefined = messageSegments.splice(0, param.wordCount === 'unlimited' ? messageSegments.length : param.wordCount ?? 1).join(' ');

            if (!input && param.required) {
                message.channel.send(`Please type your input for \`${param.name}\`\n\n${param.description ? `**Description** ${param.description}\n` : ''}${param.choices ? `**Choices** ${util.toList(param.choices?.map(i => `\`${i}\``) ?? [], 'or')}` : ''}`);

                input = (await message.channel.awaitMessages(res => res.author.id === message.author.id, { time: 15000, max: 1 })).first()?.content;

                if (!input) return message.channel.send(`⏱️ **15s timeout** ❌ You did not provide an input for ${util.toList(parameters.slice(parameters.indexOf(param), parameters.length).filter(i => i.required).map(i => `\`${i.name}\``), 'or')}`).catch(console.error);
            }

            if (input) {
                if (typeof param.wordCount === 'number' && input.split(' ').length < param.wordCount) {
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be ${param.wordCount} words long`).catch(console.error);
                }

                if (param.choices && param.choices.length > 0) {
                    if (!param.caseSensitive && !param.choices.map(i => i.toLowerCase()).includes(input.toLowerCase())) {
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be either ${util.toList(param.choices.map(i => `\`${i}\``), 'or')}`).catch(console.error);
                    } else if (param.caseSensitive && !param.choices.includes(input)) {
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be either ${util.toList(param.choices.map(i => `\`${i}\``), 'or')}`).catch(console.error);
                    }
                }

                if (param.type === 'number' && !parseInt(input, 10)) {
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be a number`).catch(console.error);
                }

                args.push([ param.name, input ]);
            }
        }

        if (command.isGuildCommand() && message.guild)
            // @ts-expect-error
            return command.callback(message, this, new Index(args));

        if (command.isDMCommand())
            if (message.channel.type === 'dm')
                // @ts-expect-error
                return command.callback(message, this, new Index(args));

        // @ts-expect-error
        command.callback(message, this, new Index(args));
    }
}