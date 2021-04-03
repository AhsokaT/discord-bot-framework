"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const SlashBase_1 = require("../slash/SlashBase");
const discord_js_1 = require("discord.js");
const CommandManager_1 = require("../commands/CommandManager");
const REST_js_1 = require("../rest/REST.js");
class Client extends discord_js_1.Client {
    constructor(options) {
        super(options);
        if (!options)
            throw new Error('No argument was provided for \'ClientOptions\'');
        if (!options.token)
            throw new Error('Argument for \'ClientOptions\' had no property \'token\'');
        this.token = options.token;
        this.#slash = new SlashBase_1.SlashBase(this);
        this.#commands = new CommandManager_1.CommandManager(this, options);
    }
    #slash;
    #commands;
    logout() {
        this.destroy();
    }
    get commands() {
        return this.#commands;
    }
    get slash() {
        return this.#slash;
    }
    get discord() {
        return REST_js_1.endpointConstructor('Bot ' + this.token);
    }
}
exports.Client = Client;
