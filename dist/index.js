"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandConstructor = exports.Command = exports.Client = void 0;
const Client_js_1 = require("./client/Client.js");
exports.Client = Client_js_1.default;
const Command_js_1 = require("./structs/Command.js");
exports.Command = Command_js_1.default;
const ApplicationCommandManager_js_1 = require("./structs/ApplicationCommandManager.js");
Object.defineProperty(exports, "ApplicationCommandConstructor", { enumerable: true, get: function () { return ApplicationCommandManager_js_1.ApplicationCommandConstructor; } });
