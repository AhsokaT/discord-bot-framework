import { Client as DJSClient, ClientOptions as DJSClientOptions, Message, ClientEvents, MessageActionRow, MessageButton } from 'discord.js';
import CommandManager, { CommandManagerOptions } from '../structs/CommandManager.js';
import ApplicationCommandManager from '../structs/ApplicationCommandManager';
import { UserInput } from '../structs/Command.js';
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

        if (!this.commands.allowBots && message.author.bot)
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

        if (command.type === 'DM' && message.channel.type !== 'dm')
            return;

        if (command.type === 'Guild' && !message.guild)
            return;

        if (command.nsfw && message.channel.type !== 'dm' && !message.channel.nsfw)
            return message.channel.send('❌ This command must be run in an **NSFW** channel');

        if (command.type === 'Guild' && !message.member?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ You require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (command.type === 'Guild' && !message.guild?.me?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ I require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (command.nsfw && message.channel.type === 'dm') {
            const actions = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomID('YES')
                    .setLabel('Run')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomID('NO')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
            );

            function disableButtons(msg) {
                actions.components = actions.components.map(button => button.setDisabled(true));

                return msg.edit({
                    content: msg.content,
                    components: [actions]
                });
            }

            const question = await message.channel.send({
                content: 'This command is marked as **NSFW**, are you sure you want to run it?',
                components: [actions]
            }).catch(console.error);

            if (!question)
                return;

            const response = await message.channel.awaitMessageComponentInteraction(i => i.user.id === message.author.id, 15000).catch(util.noop);

            if (!response) {
                message.channel.send('⏱️ **15s timeout** ❌ Command cancelled').catch(console.error);

                return disableButtons(question);
            }

            if (response.customID === 'NO') {
                response.reply('Command cancelled').catch(console.error);

                return disableButtons(question);
            }

            disableButtons(question);

            response.deferUpdate();
        }

        let args: [string, UserInput][] = [];

        const parameters = command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0);

        for (const param of parameters) {
            let input: any = messageSegments.splice(0, param.wordCount === 'unlimited' ? messageSegments.length : param.wordCount ?? 1).join(' ');

            if (!input && param.required && this.commands.promptUserForInput) {
                message.channel.send(`Please type your input for \`${param.name}\`\n\n${param.description ? `**Description** ${param.description}\n` : ''}${param.choices ? `**Choices** ${util.toList(param.choices?.map(i => `\`${i}\``) ?? [], 'or')}` : ''}`);

                input = (await message.channel.awaitMessages(res => res.author.id === message.author.id, { time: 15000, max: 1 })).first()?.content;

                if (!input)
                    return message.channel.send(`⏱️ **15s timeout** ❌ You did not provide an input for ${util.toList(parameters.slice(parameters.indexOf(param), parameters.length).filter(i => i.required).map(i => `\`${i.name}\``), 'or')}`).catch(console.error);
            } else if (!input && param.required) {
                return message.channel.send(`❌ You did not provide an input for \`${param.name}\``).catch(util.noop);
            }

            if (input) {
                if (typeof param.wordCount === 'number' && input.split(' ').length < param.wordCount)
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be ${param.wordCount} words long`).catch(console.error);

                if (param.choices && param.choices.length > 0) {
                    if ((!param.caseSensitive && !param.choices.map(i => i.toLowerCase()).includes(input.toLowerCase())) || (param.caseSensitive && !param.choices.includes(input))) {
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be either ${util.toList(param.choices.map(i => `\`${i}\``), 'or')}`).catch(console.error);
                    }
                }

                if (param.type === 'number') {
                    if (isNaN(Number(input)))
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be a number`).catch(console.error);

                    input = Number(input);
                }

                if (param.type === 'boolean') {
                    if ((input.toLowerCase() !== 'true' && input.toLowerCase() !== 'false'))
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be a boolean: either 'true' or 'false'`).catch(console.error);

                    input = input.toLowerCase() === 'true' ? true : false;
                }

                if (param.type === 'member') {
                    const member = await message.guild?.members.fetch(input.filter(i => !isNaN(Number(i)))).catch(util.noop);

                    if (!member)
                        return message.channel.send(`❌ Your input for \`${param.name}\` must be a member mention or ID`).catch(console.error);

                    input = member;
                }

                args.push([param.name, new UserInput(input, param.type)]);
            }
        }

        command.callback(message, this, new Index(args));
    }
}