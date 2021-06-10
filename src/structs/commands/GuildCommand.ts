import { Message as BaseMessage, NewsChannel, PermissionResolvable, TextChannel } from 'discord.js';
import { Collection, Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import Command, { CommandProperties } from './Command.js';

interface Message extends BaseMessage {
    channel: TextChannel | NewsChannel;
}

type GuildCommandCallback = (this: GuildCommand, message: Message, client: Client, args: Index<string, string>) => void;

interface GuildCommandProperties extends CommandProperties {
    callback: GuildCommandCallback;
    permissions: Iterable<PermissionResolvable>;
    type: 'Guild';
}

class GuildCommand extends Command implements GuildCommandProperties {
    public callback: GuildCommandCallback;
    public permissions: Collection<PermissionResolvable>;
    public type: 'Guild';

    constructor(properties?: Partial<GuildCommandProperties>) {
        super(properties);

        this.type = 'Guild';
        this.permissions = new Collection();
    }

    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions: PermissionResolvable[] | PermissionResolvable[][]): this {
        permissions.flat().forEach(permission => this.permissions.add(permission));

        return this;
    }

    setCallback(callback: GuildCommandCallback): this {
        return super.setCallback(callback);
    }

    edit(properties: Partial<GuildCommandProperties>): this {
        return super.edit(properties);
    }
}

export {
    GuildCommandCallback,
    GuildCommandProperties
}

export default GuildCommand;