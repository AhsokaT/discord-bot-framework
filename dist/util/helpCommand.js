"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_js_1 = require("../structs/Command.js");
const Parameter_js_1 = require("../structs/Parameter.js");
const util_js_1 = require("./util.js");
class DefaultCommands {
    static get help() {
        function parseCommandGroup() {
        }
        return new Command_js_1.default()
            .setName('help')
            .setDescription('Display information about my commands')
            .addParameters(new Parameter_js_1.default()
            .setKey('query')
            .setDescription('Either a command, category or type')
            .setRequired(false)
            .setWordCount('unlimited'))
            .setCallback(function (message, args, client) {
            const input = util_js_1.toString(args.first()?.value).toLowerCase();
            const group = client.manager.groups.find(i => i.toLowerCase() === input);
            const command = client.manager.index.get(input) ?? client.manager.index.find(cmd => cmd.name.toLowerCase() === input) ?? client.manager.index.find(cmd => cmd.aliases.map(alias => alias.toLowerCase()).has(input));
            const type = client.manager.types.find((v, k) => k.toLowerCase() === input.toLowerCase());
            if (group) {
                const commands = client.manager.index.array().filter(command => command.group === group).map(command => {
                    const field = { name: `${client.manager.prefix}${command.name} ${command.parameters.array().length > 0 ? command.parameters.array().map(i => `\`${i.label}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };
                    return field;
                });
                const embed = new discord_js_1.MessageEmbed({
                    color: '#2F3136',
                    author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                    title: group.slice(0, 1).toUpperCase() + group.slice(1, group.length).toLowerCase(),
                    description: commands.length === 0 ? 'There are currently no commands set for this category' : '',
                    fields: commands
                });
                message.channel.send({ embeds: [embed] }).catch(console.error);
                return;
            }
            if (command) {
                let embed = new discord_js_1.MessageEmbed({
                    color: '#2F3136',
                    author: { name: command.group ? command.group.slice(0, 1).toUpperCase() + command.group.slice(1, command.group.length).toLowerCase() : client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                    title: client.manager.prefix + command.name
                });
                if (command.description)
                    embed.addField('Description', command.description, false);
                if (command.parameters.array().length > 0)
                    embed.addField('Parameters', command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0).map(i => `\`${i.label}${i.required === false ? '?' : ''}\` ${i.description ?? ''}`).join('\n'), false);
                if (command.type === 'Guild' && command.permissions.array().length > 0)
                    embed.addField('Permissions', command.permissions.array().map(i => `\`${i.toString().replace(/_/g, ' ').toLowerCase()}\``).join(' '), false);
                if (command.aliases.array().length > 0)
                    embed.addField('Aliases', command.aliases.array().map(i => `\`${i}\``).join(' '), false);
                if (command.nsfw)
                    embed.setFooter('NSFW');
                message.channel.send({ embeds: [embed] }).catch(console.error);
                return;
            }
            if (type) {
                message.channel.send({ embeds: [
                        new discord_js_1.MessageEmbed({
                            color: '#2F3136',
                            author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                            title: type.key,
                            description: type.description || 'This type has no description'
                        })
                    ] }).catch(util_js_1.noop);
                return;
            }
            const ungrouped = client.manager.index.array().filter(i => !i.group).map(command => {
                const field = { name: `${client.manager.prefix}${command.name} ${command.parameters.array().length > 0 ? command.parameters.array().map(i => `\`${i.label}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };
                return field;
            });
            const groups = client.manager.groups.array().map(group => {
                const commands = client.manager.index.array().filter(({ group: cmdGroup }) => cmdGroup === group);
                const formatted = commands.length > 0 ? commands.splice(0, 2).map(({ name, parameters }) => `**${client.manager.prefix}${name} ${parameters.map(({ label, required }) => `\`${label}${!required ? '?' : ''}\`**`).join(' ')}`).join('\n') : '';
                const field = {
                    name: group,
                    value: formatted ? `${formatted}${commands.length > 0 ? `\n**... ${commands.length} more**` : ''}` : '**No commands**',
                    inline: true
                };
                return field ?? {};
            });
            const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: client.manager.permissions.array() });
            const embed = new discord_js_1.MessageEmbed({
                color: '#2F3136',
                author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                description: `🔗 **[Invite ${client.user?.username ?? ''}](${invite})**`,
                fields: [...ungrouped, ...groups]
            });
            while (embed.fields.length % 3 !== 0)
                embed.addField('\u200B', '\u200B', true);
            message.channel.send({ embeds: [embed] }).catch(console.error);
        });
    }
}
exports.default = DefaultCommands.help;
