"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBot = void 0;
const Base_js_1 = require("./Base.js");
const CommandManager_js_1 = require("./CommandManager.js");
class DiscordBot extends Base_js_1.Base {
    constructor(options) {
        super({ ...options });
        this.#prefix = options.prefix ?? '';
        this.#allowBots = options.allowBots ?? false;
        this.#permissions = options.permissions ?? [];
        this.#commands = new CommandManager_js_1.CommandManager();
    }
    #allowBots;
    #permissions;
    #prefix;
    #commands;
    set allowBots(allowBots) {
        this.#allowBots = allowBots;
    }
    get allowBots() {
        return this.#allowBots;
    }
}
exports.DiscordBot = DiscordBot;
