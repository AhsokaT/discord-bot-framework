"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CommandManager_js_1 = require("../structs/CommandManager.js");
const ApplicationCommandManager_1 = require("../structs/ApplicationCommandManager");
const js_augmentations_1 = require("js-augmentations");
const util = require("../util/util.js");
class Client extends discord_js_1.Client {
    constructor(options) {
        super(options);
        if (options.token)
            super.token = options.token;
        this.commands = new CommandManager_js_1.default(this, options);
        this.applicationCommands = new ApplicationCommandManager_1.default(this);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    async parseMessage(message) {
        if (!this.commands.allowBots && message.author.bot)
            return;
        if (!message.content.toLowerCase().startsWith(this.commands.prefix.toLowerCase()))
            return;
        const messageSegments = message.content.split(' ');
        const name = messageSegments.shift()?.slice(this.commands.prefix.length).toLowerCase();
        if (!name)
            return;
        const command = this.commands.index.get(name) || this.commands.index.find(i => i.name.toLowerCase() === name || i.aliases.map(alias => alias.toLowerCase()).has(name));
        if (!command)
            return;
        if (command.type === 'DM' && message.channel.type !== 'dm')
            return;
        if (command.type === 'Guild' && !message.guild)
            return;
        if (command.nsfw && message.channel.type !== 'dm' && !message.channel.nsfw)
            return message.channel.send('❌ This command must be called in an **NSFW** channel');
        if (message.guild && !message.member?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ You require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);
        if (message.guild && !message.guild.me?.permissions.has(command.permissions.array()))
            return message.channel.send(`❌ I require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toString().toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);
        if (command.nsfw && message.channel.type === 'dm') {
            const actions = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                .setCustomID('YES')
                .setLabel('Run')
                .setStyle('DANGER'), new discord_js_1.MessageButton()
                .setCustomID('NO')
                .setLabel('Cancel')
                .setStyle('SECONDARY'));
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
        let args = [];
        const parameters = command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0);
        for (const param of parameters) {
            let input = messageSegments.splice(0, param.wordCount === 'unlimited' ? messageSegments.length : param.wordCount ?? 1).join(' ');
            if (!input && param.required && this.commands.promptUserForInput) {
                message.channel.send(`Please type your input for \`${param.label}\`\n\n**Type** \`${param.type}\`\n${param.description ? `**Description** ${param.description}\n` : ''}${param.choices.size > 0 ? `**Choices** ${util.toList(param.choices?.map(i => `\`${i}\``).array() ?? [], 'or')}` : ''}`);
                input = (await message.channel.awaitMessages(res => res.author.id === message.author.id, { time: 15000, max: 1 })).first()?.content;
                if (!input)
                    return message.channel.send(`⏱️ **15s timeout** ❌ You did not provide an input for ${util.toList(parameters.slice(parameters.indexOf(param), parameters.length).filter(i => i.required).map(i => `\`${i.label}\``), 'or')}`).catch(console.error);
            }
            else if (!input && param.required) {
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
                switch (param.type) {
                    case 'number':
                        if (isNaN(Number(input)))
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`number\``).catch(util.noop);
                        input = Number(input);
                        break;
                    case 'boolean':
                        if (input.toLowerCase() !== 'true' && input.toLowerCase() !== 'false')
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be either 'true' or 'false'`).catch(util.noop);
                        input = input.toLowerCase() === 'true' ? true : false;
                        break;
                    case 'channel':
                        const channel = await message.guild?.channels.fetch(snowflake).catch(util.noop);
                        if (!channel)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`channel\``).catch(util.noop);
                        input = channel;
                        break;
                    case 'member':
                        const member = await message.guild?.members.fetch(snowflake).catch(util.noop);
                        if (!member)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`member\``).catch(util.noop);
                        input = member;
                        break;
                    case 'role':
                        const role = await message.guild?.roles.fetch(snowflake).catch(util.noop);
                        if (!role)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`role\``).catch(util.noop);
                        input = role;
                        break;
                    case 'user':
                        const user = await this.users.fetch(snowflake).catch(util.noop);
                        if (!user)
                            return message.channel.send(`❌ Your input for \`${param.label}\` must be of type \`user\``).catch(util.noop);
                        input = user;
                        break;
                    default:
                        const type = this.commands.types.get(param.type);
                        if (type && !await type.predicate.bind(this)(input, message))
                            return message.channel.send(`❌ Your input for \`${param.label}\` must conform to type \`${type.key}\``).catch(util.noop);
                        break;
                }
                args.push([param.key, input]);
            }
        }
        try {
            command.callback(message, new js_augmentations_1.Index(args), this);
        }
        catch (err) {
            message.channel.send(`❌ Command \`${command.name}\` failed to run due to an internal error`).catch(util.noop);
        }
    }
}
exports.default = Client;
