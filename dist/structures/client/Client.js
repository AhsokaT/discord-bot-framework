"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const SlashBase_1 = require("../slash/SlashBase");
const discord_js_1 = require("discord.js");
const CommandManager_1 = require("../commands/CommandManager");
const APIRequest_js_1 = require("../rest/APIRequest.js");
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
        return function (auth) {
            const endpoint = ['https://discord.com/api/v8'];
            const handler = {
                get(target, name) {
                    if (name === 'toString')
                        return () => endpoint.join('/');
                    if (['get', 'post', 'patch', 'delete'].includes(name))
                        return async (options = {}) => {
                            if (!options.headers)
                                options.headers = {};
                            if (auth && !name.endsWith('callback'))
                                options.headers['Authorization'] = auth;
                            return new APIRequest_js_1.default(name, endpoint.join('/'), options).make();
                        };
                    endpoint.push(name);
                    return new Proxy(() => { }, handler);
                },
                apply(target, that, args) {
                    endpoint.push(...args);
                    return new Proxy(() => { }, handler);
                }
            };
            return new Proxy(() => { }, handler);
        }('Bot ' + this.token);
    }
}
exports.Client = Client;
