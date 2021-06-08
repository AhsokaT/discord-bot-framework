/// <reference types="node" />
import { ApplicationCommandData, ApplicationCommand, CommandInteraction, GuildResolvable, ApplicationCommandOptionData } from 'discord.js';
import Client from '../client/Client.js';
import { Index } from 'js-augmentations';
import { EventEmitter } from 'events';
declare type ApplicationCommandCallback = (interaction: CommandInteraction, client: Client) => void;
declare type ApplicationCommandResolvable = ApplicationCommandConstructor | ApplicationCommandConstructorOptions;
export { ApplicationCommandCallback, ApplicationCommandResolvable, ApplicationCommandManager };
declare class ApplicationCommandManager extends EventEmitter {
    constructor();
}
export default class ApplicationCommandManagerOld {
    client: Client;
    callbacks: Index<string, ApplicationCommandCallback>;
    constructor(client: Client);
    create(command: ApplicationCommandResolvable, guild?: GuildResolvable): Promise<ApplicationCommand | undefined>;
}
export interface ApplicationCommandConstructorOptions extends ApplicationCommandData {
    callback?: ApplicationCommandCallback;
}
export declare class ApplicationCommandConstructor implements ApplicationCommandData {
    name: string;
    description: string;
    options: ApplicationCommandOptionData[];
    defaultPermission: boolean;
    callback?: ApplicationCommandCallback;
    constructor(options?: ApplicationCommandConstructorOptions);
    setName(name: string): this;
    setDescription(description: string): this;
    setDefaultPermission(defaultPermission?: boolean): this;
    addOptions(...options: ApplicationCommandOptionData[]): this;
    setCallback(callback: ApplicationCommandCallback): this;
    normalise(): ApplicationCommandData;
    toJSON(): string;
}
