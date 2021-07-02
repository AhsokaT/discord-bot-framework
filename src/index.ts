import Client, { ClientOptions } from './client/Client.js';
import Command, { CommandOptions, CommandCallback, CommandType } from './structs/Command.js';
import Parameter, { ParameterOptions, ParameterResolvable } from './structs/Parameter.js';
import ParameterType, { ParameterTypeResolvable, ParameterTypePredicate } from './structs/ParameterType.js';
import { CommandManagerOptions, CommandResolvable } from './structs/CommandManager.js';
import SlashCommandParameter, { SlashCommandParameterOptions, SlashCommandParameterChoice, SlashCommandParameterResolvable, SlashCommandParameterType } from './structs/SlashCommandParameter.js';
import SlashCommand, { SlashCommandCallback, SlashCommandOptions } from './structs/SlashCommand.js';

const Version = '2.0.0';

export {
    Version,
    Client,
    ClientOptions,
    Command,
    CommandOptions,
    CommandCallback,
    CommandType,
    CommandResolvable,
    Parameter,
    ParameterOptions,
    ParameterResolvable,
    ParameterType,
    ParameterTypePredicate,
    ParameterTypeResolvable,
    CommandManagerOptions,
    SlashCommand,
    SlashCommandOptions,
    SlashCommandCallback,
    SlashCommandParameter,
    SlashCommandParameterOptions,
    SlashCommandParameterChoice,
    SlashCommandParameterResolvable,
    SlashCommandParameterType
}