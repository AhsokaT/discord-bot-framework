"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extensions_js_1 = require("../util/extensions.js");
class Command {
    /**
     * @param {CommandDetails} details
     */
    constructor(details) {
        this.#name = '';
        this.#description = '';
        this.#group = '';
        this.#nsfw = false;
        this.#aliases = new extensions_js_1.Collection();
        this.#parameters = new extensions_js_1.Collection();
        this.#permissions = new extensions_js_1.Collection();
        this.#callback = (message) => message.channel.send('❌ This command has not yet been programmed').catch(console.error);
        if (details)
            this.edit(details);
    }
    #name;
    #description;
    #group;
    #nsfw;
    #aliases;
    #parameters;
    #permissions;
    #callback;
    get name() {
        return this.#name;
    }
    get description() {
        return this.#description;
    }
    get aliases() {
        return this.#aliases;
    }
    get permissions() {
        return this.#permissions;
    }
    get callback() {
        return this.#callback;
    }
    get group() {
        return this.#group;
    }
    get parameters() {
        return this.#parameters;
    }
    get nsfw() {
        return this.#nsfw;
    }
    /**
     * @param name The name of your command
     */
    setName(name) {
        if (typeof name === 'string')
            this.#name = name;
        return this;
    }
    /**
     * @param description A short description of your command
     */
    setDescription(description) {
        if (typeof description === 'string')
            this.#description = description;
        return this;
    }
    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    setNSFW(nsfw = true) {
        this.#nsfw = Boolean(nsfw);
        return this;
    }
    /**
     * @param group The group of commands this command belongs to
     */
    setGroup(group) {
        if (typeof group === 'string')
            this.#group = group;
        return this;
    }
    /**
     * @param callback The function to be called when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     *
     * setCallback(function(message, client, args) {
     *      message.channel.send(this.name, this.description);
     * });
     */
    setCallback(callback) {
        if (typeof callback === 'function')
            this.#callback = callback;
        return this;
    }
    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters(
     *    { name: 'id', description: 'The ID of a member', wordCount: 1 },
     *    { name: 'role', description: 'The ID of a role', required: false }
     * );
     */
    addParameters(...parameters) {
        parameters.flat().forEach(parameter => {
            if (typeof parameter !== 'object')
                throw new TypeError('\'parameter\' must be an object of type \'ParameterType\'.');
            const { name, description, choices, wordCount, type, required, caseSensitive } = parameter;
            if (typeof name !== 'string')
                throw new TypeError('Property \'name\' of \'parameter\' must be a string.');
            if (description && typeof description !== 'string')
                throw new TypeError('Property \'description\' of \'parameter\' must be a string.');
            if (wordCount && typeof wordCount !== 'number' && wordCount !== 'unlimited')
                throw new TypeError('Property \'wordCount\' of \'parameter\' must be a number or \'unlimited\'.');
            if (type && type !== 'number' && type !== 'string')
                throw new TypeError('Property \'type\' of \'parameter\' must either be \'number\' or \'string\'.');
            if (choices && !Array.isArray(choices))
                throw new TypeError('Property \'choices\' of \'parameter\' must be an array.');
            parameter.choices?.filter(choice => typeof choice === 'string');
            parameter.required = typeof required === 'boolean' ? required : true;
            parameter.caseSensitive = typeof caseSensitive === 'boolean' ? caseSensitive : true;
            this.#parameters.add(parameter);
            this.#parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        });
        return this;
    }
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    addPermissions(...permissions) {
        permissions.filter(perm => typeof perm === 'string').forEach(this.#permissions.add);
        return this;
    }
    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    addAliases(...aliases) {
        aliases.filter(alias => typeof alias === 'string').forEach(this.#aliases.add);
        return this;
    }
    /**
     * Edit the properties of this command
     * @param details Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    edit(details) {
        const { name, nsfw, description, parameters, permissions, group, aliases, callback } = details;
        if (name)
            this.setName(name);
        if (group)
            this.setGroup(group);
        if (callback)
            this.setCallback(callback);
        if (description)
            this.setDescription(description);
        if (typeof nsfw === 'boolean')
            this.setNSFW(nsfw);
        if (Array.isArray(parameters))
            this.addParameters(...parameters);
        if (Array.isArray(permissions))
            this.addPermissions(...permissions);
        if (Array.isArray(aliases))
            this.addAliases(...aliases);
        return this;
    }
}
exports.default = Command;
