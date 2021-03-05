"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.DiscordBot = void 0;
var Bot_js_1 = require("./Bot.js");
Object.defineProperty(exports, "DiscordBot", { enumerable: true, get: function () { return Bot_js_1.DiscordBot; } });
var Command_js_1 = require("./Command.js");
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return Command_js_1.Command; } });
const Command_js_2 = require("./Command.js");
let x = new Command_js_2.Command({
    name: 'testcmd',
    callback() { }
});
console.log(x.name);
x.edit({
    name: 'bar',
    description: 'foo'
});
console.log(x.name);
