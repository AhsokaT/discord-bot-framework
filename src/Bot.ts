import { Base, BaseOptions } from './Base.js';
import { CommandManager, CommandManagerOptions } from './CommandManager.js';
import { Client, EmbedFieldData, Message, MessageEmbed, PermissionString } from 'discord.js';
import { Command, CommandOptions } from './Command.js';

export interface DiscordBotOptions extends BaseOptions, CommandManagerOptions {
    /**
     * - Whether your bot should read messages from other bots; false by default
     */
    allowBots?: boolean;
    /**
     * - The permissions to ask for when the bot is invited
     */
    permissions?: PermissionString | PermissionString[];
    /**
     * - A command prefix the bot should look for
     */
    prefix?: string;
}

export class DiscordBot extends Base {
    #allowBots: boolean;
    #permissions: PermissionString | PermissionString[];
    #prefix: string;
    #commands: CommandManager;

    constructor(options: DiscordBotOptions) {
        super({ ...options });

        this.#prefix = options.prefix ?? '';
        this.#allowBots = options.allowBots ?? false;
        this.#permissions = options.permissions ?? [];
        this.#commands = new CommandManager({ ...options });

        function toList(i: string[], trailingConnective = 'and') {
            return `${i.length > 1 ? `${i.slice(0, i.length - 1).join(', ')} ${trailingConnective} ${i[i.length - 1]}` : i }`;
        }

        async function helpCommand(this: DiscordBot, message: Message, client: Client, args: object) {
            const input = args['command'];
            const group = this.#commands.categories.find(i => i.toLowerCase() === input?.toLowerCase());
            const command = input ? this.#commands.get(input.toLowerCase()) : null;

            if (group) {
                const commands = this.#commands.all().filter(command => command.category === group).map(command => {
                    const field: EmbedFieldData = { name: `${this.#prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };

                    return field;
                });

                const embed = new MessageEmbed({
                    color: '#2F3136',
                    author: { name: this.client.user?.username, iconURL: this.client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                    title: group,
                    description: commands.length === 0 ? 'There are currently no commands set for this category' : '',
                    fields: commands
                });

                message.channel.send(embed).catch(console.error);

                return;
            }

            if (command) {
                let embed = new MessageEmbed({
                    color: '#2F3136',
                    author: { name: this.client.user?.username, iconURL: this.client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                    title: `${this.#prefix}${command.name}`
                });

                if (command.description) {
                    embed.addField('Description', command.description, false);
                }

                if (command.aliases.length > 0) {
                    embed.addField('Aliases', toList(command.aliases.map(i => `\`${i}\``)), false);
                }

                if (command.parameters.length > 0) {
                    embed.addField('Parameters', command.parameters.map(i => `\`${i.name}${i.required === false ? '?' : ''}\` ${i.description ?? ''}`).join('\n'), false);
                }

                if (command.permissions.length > 0) {
                    embed.addField('Permissions', toList(command.permissions.map(i => `\` ${i.replaceAll('_', ' ').toLowerCase()} \``)), false);
                }

                message.channel.send(embed).catch(console.error);

                return;
            }

            const ungrouped = this.#commands.all().filter(i => !i.category).map(command => {
                const field: EmbedFieldData = { name: `${this.#prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };

                return field;
            });

            const groups = this.#commands.categories.map(group => {
                const field: EmbedFieldData = { name: group, value: `\` ${this.#prefix}help ${group.toLowerCase()} \``, inline: true };

                return field;
            });

            const invite = await this.client.generateInvite({ permissions: this.#permissions });

            const embed = new MessageEmbed({
                color: '#2F3136',
                author: { name: this.client.user?.username, iconURL: this.client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                description: `🔗 **[Invite ${this.client.user?.username ?? ''}](${invite})**`,
                fields: [ ...ungrouped, ...groups ]
            });

            message.channel.send(embed).catch(console.error);
        }

        this.#commands.add({
            name: 'help',
            description: 'Display information about my commands',
            parameters: [
                {
                    name: 'command',
                    description: 'Name of a command',
                    required: false
                }
            ],
            callback: helpCommand.bind(this)
        });

        this.client.on('message', message => {
            if (message.channel.type === 'dm') return;
            if (message.author.bot && !this.#allowBots) return;
            if (!message.content.toLowerCase().startsWith(this.#prefix.toLowerCase())) return;

            const messageComponents = message.content.split(' ');
            const name = messageComponents.shift()?.slice(this.#prefix.length).toLowerCase();

            if (!name) return;

            const command = this.#commands.get(name);

            if (!command) return;

            if (!message.member?.permissions.has(command.permissions)) return message.channel.send(`❌ You require the ${command.permissions.length > 1 ? 'permissions' : 'permission'} ${toList(command.permissions.map(i => `\`${i.toLowerCase().replaceAll('_', ' ')}\``))} to run this command!`).catch(console.error);
            if (!message.guild?.me?.permissions.has(command.permissions)) return message.channel.send(`❌ I require the ${command.permissions.length > 1 ? 'permissions' : 'permission'} ${toList(command.permissions.map(i => `\`${i.toLowerCase().replaceAll('_', ' ')}\``))} to run this command!`).catch(console.error);

            let args = {};

            for (const param of command.parameters) {
                let input = messageComponents.splice(0, param.wordCount === 'unlimited' ? messageComponents.length : param.wordCount ?? 1).join(' ');

                if (!input && param.required) {
                    return message.channel.send(`❌ You did not provide an input for ${toList(command.parameters.slice(command.parameters.indexOf(param), command.parameters.length).filter(i => i.required).map(i => `\`${i.name}\``), 'or')}`).catch(console.error);
                }

                if (typeof param.wordCount === 'number' && input.split(' ').length < param.wordCount) {
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be ${param.wordCount} words long`).catch(console.error);
                }

                if (param.choices && param.choices?.length > 0 && !param.choices.includes(input)) {
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be either ${toList(param.choices.map(i => `\`${i}\``), 'or')}`).catch(console.error);
                }

                if (param.type === 'number' && !parseInt(input, 10)) {
                    return message.channel.send(`❌ Your input for \`${param.name}\` must be a number`).catch(console.error);
                }

                args[param.name.replaceAll(' ', '_')] = param.type === 'number' ? parseInt(input, 10) : input;
            }

            command.callback(message, this.client, args);
        });
    }

    get commands() {
        return this.#commands;
    }

    // Deprecated

    /**
     * @deprecated since version 1.2.0, use .commands.add();
     */
    public addCommand(command: Command | CommandOptions) {
        console.log('WARNING! \'.addCommand()\' is deprecated and will be removed, use \'.commands.add()\'');
        this.#commands.add(command);
    }

    /**
     * @deprecated since version 1.2.0, use .commands.remove();
     */
    public removeCommand(command: Command | string) {
        console.log('WARNING! \'.removeCommand()\' is deprecated and will be removed, use \'.commands.remove()\'');
        this.#commands.remove(command);
    }
}