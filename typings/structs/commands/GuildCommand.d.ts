import { Message as BaseMessage, NewsChannel, PermissionResolvable, TextChannel } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import Command, { CommandProperties } from './Command.js';
interface Message extends BaseMessage {
    channel: TextChannel | NewsChannel;
}
declare type GuildCommandCallback = (this: GuildCommand, message: Message, client: Client, args: Index<string, string>) => void;
interface GuildCommandProperties extends CommandProperties {
    callback: GuildCommandCallback;
    permissions: Iterable<PermissionResolvable>;
    type: 'Guild';
}
declare class GuildCommand extends Command implements GuildCommandProperties {
    callback: GuildCommandCallback;
    permissions: Collection<PermissionResolvable>;
    type: 'Guild';
    constructor(properties?: Partial<GuildCommandProperties>);
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions: PermissionResolvable[] | PermissionResolvable[][]): this;
    setCallback(callback: GuildCommandCallback): this;
    edit(properties: Partial<GuildCommandProperties>): this;
}
export { GuildCommandCallback, GuildCommandProperties };
export default GuildCommand;
