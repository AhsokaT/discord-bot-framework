"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APISlashCommand = exports.Command = exports.Client = void 0;
const Client_js_1 = require("./client/Client.js");
exports.Client = Client_js_1.default;
const Command_js_1 = require("./structs/Commands/Command.js");
exports.Command = Command_js_1.default;
const SlashCommand_js_1 = require("./structs/SlashCommands/SlashCommand.js");
exports.APISlashCommand = SlashCommand_js_1.default;
