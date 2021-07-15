import { Message, MessageEmbed } from 'discord.js';
import Command from '../structs/Command.js';
import Parameter from '../structs/Parameter.js';
import { noop } from './util.js';
import Client from '../client/Client.js';
import ParameterType from '../structs/ParameterType.js';

class DefaultCommands {
    static get help() {
        function parseCommandGroup(message: Message, { user, manager }: Client, group: string) {
            const embed = new MessageEmbed()
                .setColor('#2F3136')
                .setAuthor(user?.username ?? '', user?.displayAvatarURL({ size: 4096, dynamic: true }))
                .setTitle(group);

            manager.commands.filter(({ group: commandGroup }) => commandGroup === group).forEach(function({ name, parameters, description }) {
                embed.addField(name + ' ' + parameters.map(({ label, required }) => `\`${label}${!required ? '?' : ''}\``).join(' '), description ?? 'No description');
            });

            message.channel.send({ embeds: [ embed ] }).catch(noop);
        }

        function parseCommand(message: Message, { user }: Client, { name, description, group, parameters, type, permissions, nsfw, aliases }: Command) {
            let embed = new MessageEmbed()
                .setColor('#2F3136')
                .setAuthor(group ?? user?.username ?? '', user?.displayAvatarURL({ size: 4096, dynamic: true }))
                .setTitle(name);

            if (description)
                embed.addField('Description', description, false);

            if (parameters.size > 0)
                embed.addField('Parameters', parameters.array().map(({ label, required, description: parameterDescription }) => `\`${label}${!required ? '?' : ''}\` ${parameterDescription ?? ''}`).join('\n'), false);

            if (type === 'Guild' && permissions.size > 0)
                embed.addField('Permissions', permissions.map(i => `\`${i.toString().replace(/_/g, ' ').toLowerCase()}\``).join(' '), false);

            if (aliases.size > 0)
                embed.addField('Aliases', aliases.map(i => `\`${i}\``).join(' '), false);

            if (nsfw)
                embed.setFooter('NSFW');

            message.channel.send({ embeds: [ embed ] }).catch(noop);
        }

        function parseAllCommands(message: Message, client: Client) {
            const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: client.manager.permissions.array() });

            const embed = new MessageEmbed()
                .setColor('#2F3136')
                .setAuthor(client.user?.username ?? '', client.user?.displayAvatarURL({ size: 4096, dynamic: true }))
                .setDescription(`🔗 **[Invite ${client.user?.username ?? ''}](${invite})**`);

            client.manager.commands.array().filter(({ group }) => !group).forEach(function({ name, description, parameters }) {
                embed.addField(`${client.manager.prefix}${name} ` + parameters.map(({ label, required }) => `**\`${label}${!required ? '?' : ''}\`**`).join(' '), description ?? 'No description');
            });

            client.manager.groups.forEach(function(group) {
                const commands = client.manager.commands.array().filter(({ group: commandGroup }) => commandGroup === group);

                const formatted = commands.map(({ name, parameters }) => `${client.manager.prefix}${name} ` + parameters.map(({ label, required }) => `**\`${label}${!required ? '?' : ''}\`**`).join(' ')).join('\n');

                embed.addField(group, formatted ? formatted : '**No commands**', true);
            });

            while(embed.fields.length % 3 !== 0)
                embed.addField('\u200B', '\u200B', true);

            message.channel.send({ embeds: [ embed ] }).catch(noop);
        }

        function parseType(message: Message, client: Client, { key, description }: ParameterType) {
            const embed = new MessageEmbed()
                .setColor('#2F3136')
                .setAuthor(client.user?.username ?? '', client.user?.displayAvatarURL({ size: 4096, dynamic: true }))
                .setTitle(key)
                .setDescription(description ?? 'No description');

            message.channel.send({ embeds: [ embed ] }).catch(noop);
        }

        return new Command()
            .setName('help')
            .setDescription('Display information about my commands')
            .addParameters(
                new Parameter()
                    .setKey('query')
                    .setDescription('Either a command, category or type')
                    .setRequired(false)
                    .setWordCount('unlimited')
            )
            .setCallback(function(message, args, client) {
                const input = args.first();
                const query = input?.isString() ? input.value.toLowerCase() : null;

                if (!query)
                    return parseAllCommands(message, client);

                const group = client.manager.groups.find(item => item.toLowerCase() === query) ?? null;
                const command = client.manager.commands.get(query) ?? client.manager.commands.find(({ name }) => name.toLowerCase() === query) ?? null;
                const type = client.manager.types.get(query) ?? client.manager.types.find(({ key }) => key.toLowerCase() === query) ?? null;

                if (command)
                    return parseCommand(message, client, command);

                if (group)
                    return parseCommandGroup(message, client, group);

                if (type)
                    return parseType(message, client, type);
            });
    }
}

export default DefaultCommands.help;