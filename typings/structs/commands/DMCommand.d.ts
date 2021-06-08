import { DMChannel, Message as BaseMessage } from 'discord.js';
import { Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import Command, { CommandProperties } from './BaseCommand.js';
interface Message extends BaseMessage {
    channel: DMChannel;
    member: null;
    guild: null;
}
declare type DMCommandCallback = (this: DMCommand, message: Message, client: Client, args: Index<string, string>) => void;
interface DMCommandProperties extends CommandProperties {
    callback: DMCommandCallback;
}
declare class DMCommand extends Command implements DMCommandProperties {
    callback: DMCommandCallback;
    constructor(properties?: DMCommandProperties);
    setCallback(callback: DMCommandCallback): this;
    edit(properties: DMCommandProperties): this;
}
export { DMCommandCallback, DMCommandProperties };
export default DMCommand;
