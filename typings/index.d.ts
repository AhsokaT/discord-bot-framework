import Client, { ClientOptions } from './client/Client.js';
import Command, { CommandDetails, CommandCallback } from './structs/Commands/Command.js';
import { CommandIndexOptions, CommandResolvable } from './structs/Commands/CommandIndex.js';
import APISlashCommand from './structs/SlashCommands/SlashCommand.js';
import { Index, Collection } from './util/extensions.js';
export { Index, Collection, Client, ClientOptions, Command, CommandDetails, CommandResolvable, CommandCallback, APISlashCommand, CommandIndexOptions };
