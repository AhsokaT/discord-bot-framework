import { Command } from '../commands/Command.js';

export function toList(i: string[], trailingConnective = 'and') {
    return `${i.length > 1 ? `${i.slice(0, i.length - 1).join(', ')} ${trailingConnective} ${i[i.length - 1]}` : i }`;
}