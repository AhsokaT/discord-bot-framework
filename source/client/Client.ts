import { Client as DJSClient, ClientOptions as DJSClientOptions, Message } from 'discord.js';
import CommandIndex, { CommandIndexOptions } from '../structs/Commands/CommandIndex.js';
import SlashCommandIndex from '../structs/SlashCommands/ApplicationCommands';
import APIRequest from '../util/APIRequest.js';
import { Index } from '../util/extensions.js';
import * as util from '../util/util.js';

export interface ClientOptions extends DJSClientOptions, CommandIndexOptions {
    token?: string;
}

export default class Client extends DJSClient {
    public commands: CommandIndex;
    public applicationCommands: SlashCommandIndex;

    /**
     * @param {ClientOptions} options
     */
    constructor(options: ClientOptions) {
        super(options);

        if (options.token) super.token = options.token;

        this.commands = new CommandIndex(this, options);
        this.applicationCommands = new SlashCommandIndex(this);
    }

    /**
     * Reads a message from Discord and executes a command if called
     * @param message A Discord message
     */
    public async parseMessage(message: Message): Promise<any> {
        if (message.channel.type === 'dm') return;
        if (message.author.bot && !this.commands.allowBots) return;
        if (!message.content.toLowerCase().startsWith(this.commands.prefix.toLowerCase())) return;

        const messageComponents = message.content.split(' ');
        const name = messageComponents.shift()?.slice(this.commands.prefix.length).toLowerCase();

        if (!name) return;

        const command = this.commands.index.get(name);

        if (!command) return;

        if (!message.channel.nsfw && command.nsfw) return message.channel.send('❌ This command must be run in an **NSFW** channel');
        if (!message.member?.permissions.has(command.permissions.array())) return message.channel.send(`❌ You require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);
        if (!message.guild?.me?.permissions.has(command.permissions.array())) return message.channel.send(`❌ I require the ${command.permissions.size > 1 ? 'permissions' : 'permission'} ${util.toList(command.permissions.array().map(i => `\`${i.toLowerCase().replace(/_/g, ' ')}\``))} to run this command`).catch(console.error);

        let args: any = [];

        const parameters = command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0);

        for (const param of parameters) {
            let input: string | undefined = messageComponents.splice(0, param.wordCount === 'unlimited' ? messageComponents.length : param.wordCount ?? 1).join(' ');

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

        if (command.callback) command.callback(message, this, new Index(args));
    }

    get discord() {
        return function (auth: string) {
            const endpoint = [ 'https://discord.com/api/v8' ];

            const handler = {
                get(target, name) {
                    if (name === 'toString') return () => endpoint.join('/');

                    if (['get', 'post', 'patch', 'delete'].includes(name)) return async (options: any = {}) => {
                        if (!options.headers) options.headers = {};

                        if (auth && !name.endsWith('callback')) options.headers['Authorization'] = auth;
        
                        return new APIRequest(name, endpoint.join('/'), options).make();
                    };

                    endpoint.push(name);

                    return new Proxy(util.noop, handler);
                },
                apply(target, that, args) {
                    endpoint.push(...args);

                    return new Proxy(util.noop, handler);
                }
            };

            return new Proxy(util.noop, handler);
        }('Bot ' + this.token);
    }
}