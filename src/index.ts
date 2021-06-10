import Client, { ClientOptions } from './client/Client.js';
import GuildCommand, { GuildCommandCallback, GuildCommandProperties } from './structs/commands/GuildCommand.js';
import DMCommand, { DMCommandCallback, DMCommandProperties } from './structs/commands/DMCommand';
import UniversalCommand, { CommandCallback as UniversalCommandCallback, CommandProperties as UniversalCommandProperties } from './structs/commands/Command.js';
import { CommandManagerOptions, CommandResolvable } from './structs/CommandManager.js';
import { ApplicationCommandConstructorOptions, ApplicationCommandCallback, ApplicationCommandConstructor, ApplicationCommandResolvable } from './structs/ApplicationCommandManager.js';

const Version = '2.0.0';

export {
    Version,
    Client,
    ClientOptions,
    GuildCommand,
    GuildCommandCallback,
    GuildCommandProperties,
    CommandResolvable,
    DMCommand,
    DMCommandCallback,
    DMCommandProperties,
    UniversalCommand,
    UniversalCommandCallback,
    UniversalCommandProperties,
    CommandManagerOptions,
    ApplicationCommandConstructorOptions,
    ApplicationCommandCallback,
    ApplicationCommandConstructor,
    ApplicationCommandResolvable
}