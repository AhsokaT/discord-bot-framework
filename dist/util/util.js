"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUser = exports.resolveGuild = exports.Omit = exports.toArray = exports.isIterable = exports.noop = exports.toString = exports.toList = void 0;
const discord_js_1 = require("discord.js");
/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
function toList(items, trailingConnective = 'and') {
    return `${items.length > 1 ? `${items.slice(0, items.length - 1).join(', ')} ${trailingConnective} ${items[items.length - 1]}` : items}`;
}
exports.toList = toList;
/**
 * Convert any value to a string
 * @param value
 */
function toString(value) {
    return `${value}`;
}
exports.toString = toString;
/**
 * No-operation
 */
function noop() {
    // noop
}
exports.noop = noop;
function isIterable(obj) {
    return typeof obj[Symbol.iterator] === 'function';
}
exports.isIterable = isIterable;
function toArray(obj) {
    return [...obj];
}
exports.toArray = toArray;
function Omit(obj, ...keys) {
    keys.forEach(key => delete obj[key]);
    return obj;
}
exports.Omit = Omit;
// export function resolveGuild(guild: Guild | GuildEmoji | GuildMember | GuildChannel | Role, client: Client): Guild;
// export function resolveGuild(guild: Snowflake | Invite, client: Client): Promise<Guild | undefined>;
// export function resolveGuild(guild: GuildResolvable, client: Client): Guild | undefined | Promise<Guild | undefined>;
function resolveGuild(client, guild) {
    if (guild instanceof discord_js_1.Guild)
        return guild;
    if (guild instanceof discord_js_1.GuildEmoji || guild instanceof discord_js_1.GuildMember || guild instanceof discord_js_1.GuildChannel || guild instanceof discord_js_1.Role)
        return guild.guild;
    if (guild instanceof discord_js_1.Invite) {
        if (guild.guild)
            return guild.guild.fetch();
        else
            return;
    }
    return client.guilds.fetch(guild).catch();
}
exports.resolveGuild = resolveGuild;
function resolveUser(client, resolvable) {
    if (resolvable instanceof discord_js_1.User)
        return resolvable;
    if (resolvable instanceof discord_js_1.Message)
        return resolvable.author;
    if (resolvable instanceof discord_js_1.GuildMember)
        return resolvable.user;
    if (resolvable instanceof discord_js_1.ThreadMember)
        return resolvable.user;
    return client.users.fetch(resolvable).catch();
}
exports.resolveUser = resolveUser;
