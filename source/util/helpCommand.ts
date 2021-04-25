import { Message, EmbedFieldData, MessageEmbed } from 'discord.js';
import Client from '../client/Client.js';
import Command from '../structs/Commands/Command.js';

export default new Command()
    .setName('help')
    .setDescription('Display information about my commands')
    .setCallback(async function (message: Message, client: Client, args: any) {
        const input = args.first();
        const group = client.commands.groups.has(input?.toLowerCase()) ? input?.toLowerCase() : null;
        const command = input ? client.commands.index.get(input.toLowerCase()) : null;

        if (group) {
            const commands = client.commands.index.array().filter(command => command.group === group).map(command => {
                const field: EmbedFieldData = { name: `${client.commands.prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };

                return field;
            });

            const embed = new MessageEmbed({
                color: '#2F3136',
                author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                title: group.slice(0, 1).toUpperCase() + group.slice(1, group.length).toLowerCase(),
                description: commands.length === 0 ? 'There are currently no commands set for this category' : '',
                fields: commands
            });

            message.channel.send(embed).catch(console.error);

            return;
        }

        if (command) {
            let embed = new MessageEmbed({
                color: '#2F3136',
                author: { name:  command.group ? command.group.slice(0, 1).toUpperCase() + command.group.slice(1, command.group.length).toLowerCase() : client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
                title: client.commands.prefix + command.name
            });

            if (command.description) {
                embed.addField('Description', command.description, false);
            }

            if (command.parameters.length > 0) {
                embed.addField('Parameters', command.parameters.map(i => `\`${i.name}${i.required === false ? '?' : ''}\` ${i.description ?? ''}`).join('\n'), false);
            }

            if (command.permissions.length > 0) {
                embed.addField('Permissions', command.permissions.map(i => `\`${i.replace(/_/g, ' ').toLowerCase()}\``).join(' '), false);
            }

            if (command.aliases.length > 0) {
                embed.addField('Aliases', command.aliases.map(i => `\`${i}\``).join(' '), false);
            }

            if (command.nsfw) {
                embed.setFooter('NSFW');
            }

            message.channel.send(embed).catch(console.error);

            return;
        }

        const ungrouped = client.commands.index.array().filter(i => !i.group).map(command => {
            const field: EmbedFieldData = { name: `${client.commands.prefix}${command.name} ${command.parameters.length > 0 ? command.parameters.map(i => `\`${i.name}${!i.required ? '?' : ''}\``).join(' ') : ''}`, value: command.description || 'No description', inline: false };
    
            return field;
        });

        const groups = client.commands.groups.array().map(group => {
            const field: EmbedFieldData = { name: group.slice(0, 1).toUpperCase() + group.slice(1, group.length).toLowerCase(), value: `\`${client.commands.prefix}help ${group.toLowerCase()}\``, inline: true };

            return field;
        });

        const invite = await client.generateInvite({ permissions: this.permissions });

        const embed = new MessageEmbed({
            color: '#2F3136',
            author: { name: client.user?.username, iconURL: client.user?.displayAvatarURL({ size: 4096, dynamic: true }) },
            description: `🔗 **[Invite ${client.user?.username ?? ''}](${invite})**`,
            fields: [ ...ungrouped, ...groups ]
        });

        message.channel.send(embed).catch(console.error);
    });