"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInput = exports.Command = void 0;
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
class UserInput {
    constructor(value, type) {
        this.value = value;
        this.type = type;
        this.value = value;
        this.type = type;
    }
    toString() {
        return `${this.value}`;
    }
}
exports.UserInput = UserInput;
class Command {
    constructor(properties) {
        this.type = 'Universal';
        this.aliases = new js_augmentations_1.Collection();
        this.parameters = new js_augmentations_1.Collection();
        this.callback = (message) => message.channel.send('❌ This command has not yet been programmed').catch(console.error);
        if (properties)
            this.edit(properties);
    }
    /**
     * @param name The name of your command
     */
    setName(name) {
        if (typeof name !== 'string')
            throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);
        this.name = name;
        return this;
    }
    /**
     * @param description A short description of your command
     */
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);
        this.description = description;
        return this;
    }
    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    setNSFW(nsfw = true) {
        if (typeof nsfw !== 'boolean')
            throw new TypeError(`Type '${typeof nsfw}' is not assignable to type 'boolean'.`);
        this.nsfw = nsfw;
        return this;
    }
    /**
     * @param group The group of commands this command belongs to
     */
    setGroup(group) {
        if (typeof group !== 'string')
            throw new TypeError(`Type '${typeof group}' is not assignable to type 'string'.`);
        this.group = group;
        return this;
    }
    /**
     * @param type WIP
     */
    setType(type) {
        if (type !== 'DM' && type !== 'Guild' && type !== 'Universal')
            throw new TypeError(`Value '${type}' is not assignable to type 'CommandType'.`);
        this.type = type;
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
        if (typeof callback !== 'function')
            throw new TypeError(`Type '${typeof callback}' is not assignable to type 'function'.`);
        this.callback = callback;
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
        parameters.map(param => util_js_1.isIterable(param) ? [...param] : param).flat().forEach(parameter => {
            if (!('name' in parameter) && typeof parameter['name'] !== 'string')
                throw new TypeError('Command parameters must conform to type \'CommandParameter\'');
            const { name, description, choices, wordCount, type, required, caseSensitive } = parameter;
            if (typeof name !== 'string')
                throw new TypeError(`Type '${typeof name}' is not assignable to type 'string'.`);
            if (description && typeof description !== 'string')
                throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);
            if (wordCount && typeof wordCount !== 'number' && wordCount !== 'unlimited')
                throw new TypeError(`Type '${typeof wordCount}' is not assignable to type 'number'.`);
            if (type && Boolean(0))
                throw new TypeError(`Type '${typeof type}' is not assignable to type 'string | number'.`);
            if (choices && !Array.isArray(choices))
                throw new TypeError(`Type '${typeof choices}' is not assignable to type 'array'.`);
            parameter.choices?.filter(choice => typeof choice === 'string');
            parameter.required = typeof required === 'boolean' ? required : true;
            parameter.caseSensitive = typeof caseSensitive === 'boolean' ? caseSensitive : true;
            this.parameters.add(parameter);
        });
        this.parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        return this;
    }
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions) {
        permissions.forEach(permission => this.permissions.add(permission));
        return this;
    }
    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    addAliases(...aliases) {
        aliases.filter(alias => typeof alias === 'string').forEach(alias => this.aliases.add(alias));
        return this;
    }
    /**
     * Edit the properties of this command
     * @param properties Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Delete messages' });
     */
    edit(properties) {
        if (typeof properties !== 'object')
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'object'.`);
        const { name, nsfw, description, parameters, group, aliases, callback, type } = properties;
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
        if (type)
            this.setType(type);
        if (util_js_1.isIterable(parameters))
            this.addParameters(...parameters);
        if (util_js_1.isIterable(aliases))
            this.addAliases(...aliases);
        return this;
    }
}
exports.Command = Command;
exports.default = Command;
