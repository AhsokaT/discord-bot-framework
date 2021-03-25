"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Command_js_1 = require("./Command.js");
const discord_js_1 = require("discord.js");
class CommandManager {
    constructor(client, options) {
        this.#commands = [];
        this.#categories = [];
        if (options?.categories && Array.isArray(options.categories))
            this.#categories = options.categories;
        this.#prefix = options?.prefix ?? '';
        this.#allowBots = options?.allowBots ?? false;
        this.#permissions = options?.permissions ?? [];
        this.#client = client;
        function toList(i, trailingConnective = 'and') {
            return `${i.length > 1 ? `${i.slice(0, i.length - 1).join(', ')} ${trailingConnective} ${i[i.length - 1]}` : i}`;
        }
        async function helpCommand(message, client, args) {
            const input = args['command'];
            const group = this.categories.find(i => i.toLowerCase() === input?.toLowerCase());
            const command = input ? this.get(input.toLowerCase()) : null;
            if (group) {
                const commands = this.all().filter(command => command.category === group).map(command => {
                    const field = { name: `${this.#prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };
                    return field;
                });
                const embed = new discord_js_1.MessageEmbed({
                    color: '#2F3136',
                    author: { name: this.#client.user?.username, iconURL: this.#client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                    title: group,
                    description: commands.length === 0 ? 'There are currently no commands set for this category' : '',
                    fields: commands
                });
                message.channel.send(embed).catch(console.error);
                return;
            }
            if (command) {
                let embed = new discord_js_1.MessageEmbed({
                    color: '#2F3136',
                    author: { name: this.#client.user?.username, iconURL: this.#client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
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
            const ungrouped = this.all().filter(i => !i.category).map(command => {
                const field = { name: `${this.#prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };
                return field;
            });
            const groups = this.categories.map(group => {
                const field = { name: group, value: `\` ${this.#prefix}help ${group.toLowerCase()} \``, inline: true };
                return field;
            });
            const invite = await this.#client.generateInvite({ permissions: this.#permissions });
            const embed = new discord_js_1.MessageEmbed({
                color: '#2F3136',
                author: { name: this.#client.user?.username, iconURL: this.#client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                description: `🔗 **[Invite ${this.#client.user?.username ?? ''}](${invite})**`,
                fields: [...ungrouped, ...groups]
            });
            message.channel.send(embed).catch(console.error);
        }
        this.add({
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
        this.#client.on('message', message => {
            if (message.channel.type === 'dm')
                return;
            if (message.author.bot && !this.#allowBots)
                return;
            if (!message.content.toLowerCase().startsWith(this.#prefix.toLowerCase()))
                return;
            const messageComponents = message.content.split(' ');
            const name = messageComponents.shift()?.slice(this.#prefix.length).toLowerCase();
            if (!name)
                return;
            const command = this.get(name);
            if (!command)
                return;
            if (!message.member?.permissions.has(command.permissions))
                return message.channel.send(`❌ You require the ${command.permissions.length > 1 ? 'permissions' : 'permission'} ${toList(command.permissions.map(i => `\`${i.toLowerCase().replaceAll('_', ' ')}\``))} to run this command!`).catch(console.error);
            if (!message.guild?.me?.permissions.has(command.permissions))
                return message.channel.send(`❌ I require the ${command.permissions.length > 1 ? 'permissions' : 'permission'} ${toList(command.permissions.map(i => `\`${i.toLowerCase().replaceAll('_', ' ')}\``))} to run this command!`).catch(console.error);
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
            command.callback(message, this.#client, args);
        });
    }
    #commands;
    #categories;
    #allowBots;
    #permissions;
    #prefix;
    #client;
    get allowBots() {
        return this.#allowBots;
    }
    set allowBots(allowBots) {
        if (typeof allowBots === 'boolean')
            this.#allowBots = allowBots;
    }
    get categories() {
        return this.#categories;
    }
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     */
    add(command) {
        if (!command?.name || !command?.callback)
            throw new Error('Argument for \'command\' did not conform to either \'Command\' or \'CommandOptions\'');
        if (command.aliases) {
            for (const cmd of this.#commands) {
                for (const alias of cmd.aliases ?? []) {
                    if (command.aliases.includes(alias)) {
                        throw new Error(`Alias '${alias}' already exists on command '${cmd.name}'`);
                    }
                }
            }
        }
        if (command.category && !this.#categories.includes(command.category))
            throw new Error(`There is no existing command category named '${command.category}'`);
        const existingCommand = this.#commands.find(cmd => cmd.name === command.name);
        if (existingCommand)
            return existingCommand.edit({ ...command });
        const newCommand = command instanceof Command_js_1.Command ? command : new Command_js_1.Command({ ...command });
        this.#commands.push(newCommand);
        return newCommand;
    }
    /**
     * Removes an existing command and returns it
     * @param command The name or alias of a command or an instance of the Command class
     */
    remove(command) {
        const existingCommand = this.#commands.find(i => i.name === command || i === command || i.aliases.includes(command.toString()));
        if (!existingCommand)
            return;
        this.#commands.splice(this.#commands.indexOf(existingCommand), 1);
        return existingCommand;
    }
    /**
     * Returns a single command
     * @param command The name or alias of a command or an instance of the Command class
     */
    get(command) {
        return this.#commands.find(i => i.name === command || i === command || i.aliases.includes(command.toString()));
    }
    /**
     * Returns an array of all commands
     */
    all() {
        const commands = this.#commands;
        return commands;
    }
}
exports.CommandManager = CommandManager;
