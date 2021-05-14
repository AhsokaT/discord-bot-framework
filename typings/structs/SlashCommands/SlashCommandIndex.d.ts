/// <reference types="node" />
import { ClientApplication } from 'discord.js';
import Client from '../../client/Client.js';
import { Index } from '../../util/extensions.js';
import APISlashCommand, { APIApplicationCommandDetails, SlashCallback, SlashCommand } from './SlashCommand.js';
import { EventEmitter } from 'events';
import { Interaction } from './Interaction.js';
export default class SlashCommandIndex extends EventEmitter {
    client: Client;
    cache: Index<string, SlashCommand>;
    application: ClientApplication | null;
    constructor(client: Client);
    on(event: 'commandCall', listener: SlashCallback): this;
    on(event: 'commandUpdate', listener: (previous: SlashCommand, updated: SlashCommand) => void): this;
    on(event: 'commandDelete', listener: (command: SlashCommand) => void): this;
    on(event: 'commandCreate', listener: (command: SlashCommand) => void): this;
    once(event: 'commandCall', listener: SlashCallback): this;
    once(event: 'commandUpdate', listener: (previous: SlashCommand, updated: SlashCommand) => void): this;
    once(event: 'commandDelete', listener: (command: SlashCommand) => void): this;
    once(event: 'commandCreate', listener: (command: SlashCommand) => void): this;
    emit(event: 'commandCall', interaction: Interaction, client: Client): boolean;
    emit(event: 'commandUpdate', previous: SlashCommand, updated: SlashCommand): boolean;
    emit(event: 'commandDelete', command: SlashCommand): boolean;
    emit(event: 'commandCreate', command: SlashCommand): boolean;
    private updateCache;
    /**
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand[]>}
     */
    fetchAll(guildID?: string): Promise<SlashCommand[]>;
    /**
     *
     * @param {string} id The ID of a slash command
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | null>}
     */
    fetch(id: string, guildID?: string): Promise<SlashCommand | undefined>;
    /**
     * Post a new slash command to Discord.
     *
     * If an existing command has the same name then the existing command will be returned.
     * @param {SlashCommand | SlashCommandOptions} command An instance of the slash command class or an object of type SlashCommandOptions
     * @param {string} guildID The ID of a Discord server
     * @returns {Promise<SlashCommand | undefined>}
     */
    post(command: APISlashCommand | APIApplicationCommandDetails): Promise<SlashCommand | undefined>;
    edit(command: SlashCommand, details: Partial<Omit<APIApplicationCommandDetails, 'guildID'>>): Promise<SlashCommand | undefined>;
    delete(command: SlashCommand): Promise<SlashCommand | undefined>;
}
