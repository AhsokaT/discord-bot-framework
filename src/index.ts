import client from './structures/rest/RESTClient.js';

export { Client, ClientOptions } from './structures/client/Client.js';
export { Command, CommandInfo } from './structures/commands/Command.js';
export { SlashCommand } from './structures/slash/Slash.js';
export * as DiscordJS from 'discord.js';
export const RESTClient = client;