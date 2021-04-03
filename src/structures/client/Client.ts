import { SlashBase } from '../slash/SlashBase';
import { Client as DJSClient } from 'discord.js';
import { ClientOptions as DJSClientOptions } from 'discord.js';
import { CommandManager, CommandManagerOptions } from '../commands/CommandManager';
import { endpointConstructor } from '../rest/REST.js';

export interface ClientOptions extends CommandManagerOptions, DJSClientOptions {
    token: string;
}

export class Client extends DJSClient {
    #slash: SlashBase;
    #commands: CommandManager;

    constructor(options: ClientOptions) {
        super(options);

        if (!options) throw new Error('No argument was provided for \'ClientOptions\'');
        if (!options.token) throw new Error('Argument for \'ClientOptions\' had no property \'token\'');

        this.token = options.token;

        this.#slash = new SlashBase(this);
        this.#commands = new CommandManager(this, options);
    }

    public logout(): void {
        this.destroy();
    }

    get commands() {
        return this.#commands;
    }

    get slash() {
        return this.#slash;
    }

    get discord() {
        return endpointConstructor('Bot ' + this.token);
    }
}