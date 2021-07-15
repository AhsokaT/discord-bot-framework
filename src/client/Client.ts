import { Client as DJSClient, ClientOptions as DJSClientOptions, Message, MessageActionRow, MessageButton, ThreadChannel } from 'discord.js';
import CommandManager, { CommandManagerOptions } from '../structs/CommandManager.js';
import SlashCommandManager from '../structs/SlashCommandManager.js';
import Argument from '../structs/Argument.js';
import { Index } from 'js-augmentations';
import * as util from '../util/util.js';

export interface ClientOptions extends DJSClientOptions, CommandManagerOptions {
    token?: string;
}

export default class Client extends DJSClient {
    public readonly manager: CommandManager;
    public readonly slashCommands: SlashCommandManager;

    constructor(options: ClientOptions) {
        super(options);

        if (options.token)
            super.token = options.token;

        this.manager = new CommandManager(this, options);
        this.slashCommands = new SlashCommandManager(this);
    }

    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    public async parseMessage(message: Message): Promise<any> {
        if (message.author.bot && !this.manager.allowBots)
            return;

        if (!message.content.toLowerCase().startsWith(this.manager.prefix.toLowerCase()))
            return;

        const messageSegments = message.content.split(' ');
        const commandName = messageSegments.shift()?.slice(this.manager.prefix.length).toLowerCase();

        if (!commandName)
            return;

        const command = this.manager.index.get(commandName) || this.manager.index.find(({name, aliases}) => name.toLowerCase() === name || aliases.map(alias => alias.toLowerCase()).has(name));

        if (!command)
            return;

        if (command.allowedUsers.size > 0 && !command.allowedUsers.has(message.author.id))
            return;

        if (message.guild && command.allowedGuilds.size > 0 && !command.allowedGuilds.has(message.guild.id))
            return;

        if (command.type === 'DM' && message.channel.type !== 'DM')
            return;

        if (command.type === 'Guild' && !message.guild)
            return;

        if (command.nsfw && message.channel.type !== 'DM' && !(message.channel instanceof ThreadChannel) && !message.channel.nsfw)
            return message.channel.send('❌ This command must be called in an **NSFW** channel');

        if (message.guild && !message.member?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ You require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (message.guild && !message.guild.me?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ I require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        if (command.nsfw && message.channel.type === 'DM') {
            const actions = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('YES')
                    .setLabel('Run')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('NO')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
            );

            const question = await message.channel.send({
                content: 'This command is marked as **NSFW**, are you sure you want to run it?',
                components: [actions]
            }).catch(console.error);

            if (!question)
                return;

            // @ts-expect-error
            const response = await message.channel.awaitMessageComponentInteraction({ filter: i => i.user.id === message.author.id, time: 15000 }).catch(util.noop);

            if (!response) {
                message.channel.send('⏱️ **15s timeout** ❌ Command cancelled').catch(console.error);

                return question.delete().catch(util.noop);
            }

            if (response.customID === 'NO') {
                response.deferUpdate().catch(util.noop);

                return question.delete().catch(util.noop);
            }

            question.delete().catch(util.noop);

            response.deferUpdate();
        }

        let args: [string, Argument][] = [];

        const parameters = command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0);

        for (const param of parameters) {
            let input: any = messageSegments.splice(0, param.wordCount === 'unlimited' ? messageSegments.length : param.wordCount ?? 1).join(' ');

            if (!input && param.required && this.manager.promptUserForInput) {
                message.channel.send(`Please type your input for \`${param.label}\`\n\n**Type** \`${param.type}\`\n${param.description ? `**Description** ${param.description}\n` : ''}${param.choices.size > 0 ? `**Choices** ${util.toList(param.choices?.map(i => `\`${i}\``).array() ?? [], 'or')}` : ''}`);

                input = (await message.channel.awaitMessages({ filter: res => res.author.id === message.author.id, time: param.timeout, max: 1 })).first()?.content;

                if (!input)
                    return message.channel.send(`⏱️ **${param.timeout / 1000}s timeout** ❌ You did not provide an input for ${util.toList(parameters.slice(parameters.indexOf(param), parameters.length).filter(i => i.required).map(i => `\`${i.label}\``), 'or')}`).catch(console.error);
            } else if (!input && param.required) {
                return message.channel.send(`❌ You did not provide an input for \`${param.label}\``).catch(util.noop);
            }

            if (input) {
                const snowflake = input.split('').filter(char => !isNaN(Number(char))).join('');

                if (typeof param.wordCount === 'number' && input.split(' ').length < param.wordCount)
                    return message.channel.send(`❌ Your input for \`${param.label}\` must be ${param.wordCount} words long`).catch(console.error);

                if (param.choices && param.choices.size > 0) {
                    if ((!param.caseSensitive && !param.choices.map(i => i.toLowerCase()).has(input.toLowerCase())) || (param.caseSensitive && !param.choices.has(input)))
                        return message.channel.send(`❌ Your input for \`${param.label}\` must be either ${util.toList(param.choices.map(i => `\`${i}\``).array(), 'or')}`).catch(console.error);
                }

                switch (param.type.toLowerCase()) {
                    case 'number':
                        if (isNaN(Number(input)))
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`number\``).catch(util.noop);

                        input = new Argument(Number(input), 'Number', param);
                        break;

                    case 'boolean':
                        if (input.toLowerCase() !== 'true' && input.toLowerCase() !== 'false')
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be either 'true' or 'false'`).catch(util.noop);

                        input = new Argument(input.toLowerCase() === 'true' ? true : false, 'Boolean', param);
                        break;

                    case 'channel':
                        const channel = await message.guild?.channels.fetch(snowflake).catch(util.noop);

                        if (!channel)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`channel\``).catch(util.noop);

                        input = new Argument(channel, 'Channel', param);
                        break;

                    case 'member':
                        const member = snowflake ? await message.guild?.members.fetch(snowflake).catch(util.noop) : null;

                        if (!member || !snowflake)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`member\``).catch(util.noop);

                        input = new Argument(member, 'Member', param);
                        break;

                    case 'role':
                        const role = await message.guild?.roles.fetch(snowflake).catch(util.noop);

                        if (!role)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`role\``).catch(util.noop);

                        input = new Argument(role, 'Role', param);
                        break;

                    case 'user':
                        const user = await this.users.fetch(snowflake).catch(util.noop);

                        if (!user)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`user\``).catch(util.noop);

                        input = new Argument(user, 'User', param);
                        break;

                    default:
                        const type = this.manager.types.get(param.type);

                        if (type) {
                            if (!await type.predicate.bind(this)(input, message))
                                return message.channel.send(`❌ Your input for \`${param.label}\` must conform to type \`${type.key}\``).catch(util.noop);

                            input = new Argument(input, type, param);
                        }

                        break;
                }

                if (!(input instanceof Argument))
                    input = new Argument(param.default ? param.default : input, 'String', param);

                args.push([param.key, input]);
            }
        }

        try {
            command.callback(message, new Index(args), this);
        } catch (err) {
            console.log(err);
            message.channel.send(`❌ Command \`${command.name}\` failed to run due to an internal error`).catch(util.noop);
        }
    }
}