"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const discord_js_1 = require("discord.js");
class Base {
    constructor(options) {
        if (!options?.token)
            throw new Error('No argument for \'BaseOptions.token\' was provided');
        this.#token = options.token;
        this.#client = new discord_js_1.Client(options.clientOptions);
    }
    #token;
    #client;
    async login() {
        const res = await this.#client.login(this.#token).catch(console.error);
        if (res)
            return this.#client;
    }
    logout() {
        this.#client.destroy();
    }
    get client() {
        return this.#client;
    }
    get token() {
        return this.#token;
    }
}
exports.Base = Base;
