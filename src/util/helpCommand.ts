import { EmbedFieldData, MessageEmbed } from 'discord.js';
import Command from '../structs/Command.js';
import { toString } from './util.js';

export default new Command()
    .setName('help')
    .setDescription('Display information about my commands')
    .addParameters({
        name: 'command',
        type: 'string',
        description: 'Name of a command or category',
        required: false
    })
    .setCallback(function (message, client, args) {
        const input = toString(args.first()).toLowerCase();
        const group = client.commands.groups.find(i => i.toLowerCase() === input) ?? null;
        const command = client.commands.index.get(input) ?? client.commands.index.find(cmd => cmd.name.toLowerCase() === input) ?? client.commands.index.find(cmd => cmd.aliases.map(alias => alias.toLowerCase()).has(input));

        if (group) {
            const commands = client.commands.index.array().filter(command => command.group === group).map(command => {
                const field: EmbedFieldData = { name: `${client.commands.prefix}${command.name} ${command.parameters.array().length > 0 ? command.parameters.array().map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };

                return field;
            });

            const embed = new MessageEmbed({
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
            let embed = new MessageEmbed({
                color: '#2F3136',
                author: { name:  command.group ? command.group.slice(0, 1).toUpperCase() + command.group.slice(1, command.group.length).toLowerCase() : client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                title: client.commands.prefix + command.name
            });

            if (command.description)
                embed.addField('Description', command.description, false);

            if (command.parameters.array().length > 0)
                embed.addField('Parameters', command.parameters.array().sort((a, b) => a.required && !b.required ? -1 : 0).map(i => `\`${i.name}${i.required === false ? '?' : ''}\` ${i.description ?? ''}`).join('\n'), false);

            if (command.type === 'Guild' && command.permissions.array().length > 0)
                embed.addField('Permissions', command.permissions.array().map(i => `\`${i.toString().replace(/_/g, ' ').toLowerCase()}\``).join(' '), false);

            if (command.aliases.array().length > 0)
                embed.addField('Aliases', command.aliases.array().map(i => `\`${i}\``).join(' '), false);

            if (command.nsfw)
                embed.setFooter('NSFW');

            message.channel.send({ embeds: [embed] }).catch(console.error);

            return;
        }

        const ungrouped = client.commands.index.array().filter(i => !i.group).map(command => {
            const field: EmbedFieldData = { name: `${client.commands.prefix}${command.name} ${command.parameters.array().length > 0 ? command.parameters.array().map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };

            return field;
        });

        const groups = client.commands.groups.array().map(group => {
            const field: EmbedFieldData = { name: group.slice(0, 1).toUpperCase() + group.slice(1, group.length).toLowerCase(), value: `\`${client.commands.prefix}help ${group.toLowerCase()}\``, inline: true };

            return field;
        });

        const invite = client.generateInvite({ permissions: client.commands.permissions.array() });

        const embed = new MessageEmbed({
            color: '#2F3136',
            author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
            description: `🔗 **[Invite ${client.user?.username ?? ''}](${invite})**`,
            fields: [ ...ungrouped, ...groups ]
        });

        message.channel.send({ embeds: [embed] }).catch(console.error);
    });