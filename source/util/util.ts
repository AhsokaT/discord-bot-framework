import {} from 'discord.js';
import Client from '../client/Client.js';
import Command from '../structs/Commands/Command.js';
import CommandIndex from '../structs/commands/CommandIndex.js';

export function toList(i: string[], trailingConnective = 'and') {
    return `${i.length > 1 ? `${i.slice(0, i.length - 1).join(', ')} ${trailingConnective} ${i[i.length - 1]}` : i }`;
}