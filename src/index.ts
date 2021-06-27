import Client, { ClientOptions } from './client/Client.js';
import Command, { CommandOptions, CommandCallback, CommandType } from './structs/Command.js';
import Parameter, { ParameterOptions, ParameterResolvable } from './structs/Parameter.js';
import ParameterType, { ParameterTypeResolvable, ParameterTypePredicate } from './structs/ParameterType.js';
import { CommandManagerOptions, CommandResolvable } from './structs/CommandManager.js';
import SlashCommandOption, { SlashCommandOptionDetails, SlashCommandOptionChoice, SlashCommandOptionResolvable, SlashCommandOptionType, APISlashCommandOption } from './structs/SlashCommandOption.js';
import APISlashCommand, { APISlashCommandCallback, APISlashCommandOptions } from './structs/APISlashCommand.js';

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
    APISlashCommand,
    APISlashCommandCallback,
    SlashCommandOption,
    APISlashCommandOptions,
    SlashCommandOptionDetails,
    SlashCommandOptionChoice,
    SlashCommandOptionResolvable,
    SlashCommandOptionType,
    APISlashCommandOption
}