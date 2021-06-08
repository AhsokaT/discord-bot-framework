import { DMChannel, Message as BaseMessage } from 'discord.js';
import { Index } from 'js-augmentations';
import Client from '../../client/Client.js';
import Command, { CommandProperties } from './Command.js';

interface Message extends BaseMessage {
    channel: DMChannel;
    member: null;
    guild: null;
}

type DMCommandCallback = (this: DMCommand, message: Message, client: Client, args: Index<string, string>) => void;

interface DMCommandProperties extends CommandProperties {
    callback: DMCommandCallback;
}

class DMCommand extends Command implements DMCommandProperties {
    public callback: DMCommandCallback;

    constructor(properties?: DMCommandProperties) {
        super(properties);
    }

    setCallback(callback: DMCommandCallback): this {
        return super.setCallback(callback);
    }

    edit(properties: DMCommandProperties): this {
        return super.edit(properties);
    }
}

export {
    DMCommandCallback,
    DMCommandProperties
}

export default DMCommand;