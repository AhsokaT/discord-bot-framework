import { GuildResolvable, Guild, GuildEmoji, GuildChannel, GuildMember, Invite, Role, UserResolvable, User, Message, ThreadMember } from 'discord.js';
import Client from '../client/Client.js';
import { Awaited } from './types.js';

/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
export function toList(items: string[], trailingConnective = 'and') {
    return `${items.length > 1 ? `${items.slice(0, items.length - 1).join(', ')} ${trailingConnective} ${items[items.length - 1]}` : items }`;
}

/**
 * Convert any value to a string
 * @param value
 */
export function toString(value: any) {
    return `${value}`;
}

/**
 * No-operation
 */
export function noop() {
    // noop
}

export function isIterable(obj: any): obj is Iterable<any> {
    return typeof obj[Symbol.iterator] === 'function';
}

export function toArray<U>(obj: Iterable<U>): U[] {
    return [ ...obj ];
}

interface AnyObject {
    [key: string]: any;
}

export function Omit<O extends AnyObject, K extends keyof O>(obj: O, ...keys: K[]): Omit<O, K> {
    keys.forEach(key => delete obj[key]);

    return obj;
}

// export function resolveGuild(guild: Guild | GuildEmoji | GuildMember | GuildChannel | Role, client: Client): Guild;
// export function resolveGuild(guild: Snowflake | Invite, client: Client): Promise<Guild | undefined>;
// export function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined>;
export function resolveGuild(client: Client, guild: GuildResolvable): Awaited<Guild | undefined> {
    if (guild instanceof Guild)
        return guild;

    if (guild instanceof GuildEmoji || guild instanceof GuildMember || guild instanceof GuildChannel || guild instanceof Role)
        return guild.guild;

    if (guild instanceof Invite) {
        if (guild.guild)
            return guild.guild.fetch();
        else
            return;
    }

    return client.guilds.fetch(guild).catch();
}

export function resolveUser(client: Client, resolvable: UserResolvable): Awaited<User | null> {
    if (resolvable instanceof User)
        return resolvable;

    if (resolvable instanceof Message)
        return resolvable.author;

    if (resolvable instanceof GuildMember)
        return resolvable.user;

    if (resolvable instanceof ThreadMember)
        return resolvable.user;

    return client.users.fetch(resolvable).catch();
}