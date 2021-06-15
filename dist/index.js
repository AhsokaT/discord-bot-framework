"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationCommandConstructor = exports.UniversalCommand = exports.DMCommand = exports.GuildCommand = exports.Client = exports.Version = void 0;
const Client_js_1 = require("./client/Client.js");
exports.Client = Client_js_1.default;
const GuildCommand_js_1 = require("./structs/commands/GuildCommand.js");
exports.GuildCommand = GuildCommand_js_1.default;
const DMCommand_1 = require("./structs/commands/DMCommand");
exports.DMCommand = DMCommand_1.default;
const Command_js_1 = require("./structs/commands/Command.js");
exports.UniversalCommand = Command_js_1.default;
const ApplicationCommandManager_js_1 = require("./structs/ApplicationCommandManager.js");
Object.defineProperty(exports, "ApplicationCommandConstructor", { enumerable: true, get: function () { return ApplicationCommandManager_js_1.ApplicationCommandConstructor; } });
const util_js_1 = require("./util/util.js");
let obj = {
    foo: true,
    bar: false,
    baz: 3,
    kiwi: Boolean
};
let omitted = util_js_1.Omit(obj, 'foo', 'baz');
console.log(omitted);
const Version = '2.0.0';
exports.Version = Version;
