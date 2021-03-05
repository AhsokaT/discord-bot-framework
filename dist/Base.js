"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const discord_js_1 = require("discord.js");
class Base {
    constructor(options) {
        if (!options?.token)
            throw new Error('No argument for parameter \'BaseOptions.token\' was provided');
        this.#token = options.token;
        this.#client = new discord_js_1.Client(options.clientOptions);
        this.login();
    }
    #token;
    #client;
    async login() {
        const res = await this.#client.login(this.#token).catch(console.error);
        if (res)
            return this.#client;
    }
    logOut() {
        this.#client.destroy();
    }
    get client() {
        return this.#client;
    }
}
exports.Base = Base;
