"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashBase = void 0;
const Slash_js_1 = require("./Slash.js");
const superagent_1 = require("superagent");
class SlashBase {
    constructor(client, token) {
        this.#client = client;
        this.#token = token;
    }
    #token;
    #client;
    #appID;
    #guildID;
    #callbacks;
    async endpoint() {
        if (!this.#appID)
            this.#appID = (await this.#client.fetchApplication()).id;
        return `https://discord.com/api/v8/applications/${this.#appID}/${this.#guildID ? `guilds/${this.#guildID}/commands` : 'commands'}`;
    }
    /**
     * Alter your slash commands on a server; alterations to server scope commands take place immediately
     * @param id The ID of a Discord server
     */
    guild(id) {
        if (typeof id === 'string')
            this.#guildID = id;
        return this;
    }
    /**
     * Alter your slash commands on the global scope; alterations to global scope commands can take up to an hour to cache
     */
    global() {
        this.#guildID = undefined;
        return this;
    }
    /**
     * @returns an array of your slash commands.
     */
    async all() {
        const endpoint = await this.endpoint();
        const res = await superagent_1.get(endpoint).set('Authorization', 'Bot ' + this.#token).catch(console.error);
        return res ? res.body.map(i => new Slash_js_1.SlashCommand(i)) : [];
    }
    /**
     * Post your slash command to Discord.
     * @param command An instance of the SlashCommand class.
     */
    async post(command) {
        const endpoint = await this.endpoint();
        if (!(command instanceof Slash_js_1.SlashCommand))
            return;
        if (!command.name)
            throw new Error('Slash commands must have a valid name set; a string with a length greater than zero.');
        if (!command.description)
            throw new Error('Slash commands must have a valid description set; a string with a length greater than zero.');
        const postedCommand = await superagent_1.post(endpoint).send(command.toJSON()).set('Content-Type', 'application/json').set('Authorization', 'Bot ' + this.#token).catch(console.error);
        if (!postedCommand)
            return;
        return new Slash_js_1.SlashCommand(postedCommand.body);
    }
    /**
     * Delete an existing slash command.
     * @param command The name or ID of a slash command.
     */
    async delete(command) {
        if (!command)
            throw new Error('You must provide the name or ID of a slash command.');
        const endpoint = await this.endpoint();
        const toDelete = (await this.all()).find(i => i.name === command || i.id === command);
        if (!toDelete)
            return;
        const deleted = await superagent_1.del(endpoint + `/${toDelete.id}`).set('Authorization', 'Bot ' + this.#token).catch(console.error);
        if (deleted && deleted.status === 204)
            return toDelete;
    }
}
exports.SlashBase = SlashBase;
