"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
const Parameter_js_1 = require("./Parameter.js");
class Command {
    name;
    description;
    group;
    nsfw;
    aliases;
    parameters;
    callback;
    permissions;
    type;
    constructor(properties) {
        this.aliases = new js_augmentations_1.Collection();
        this.parameters = new js_augmentations_1.Collection();
        this.permissions = new js_augmentations_1.Collection();
        this.setType('Universal');
        this.setCallback((message) => message.channel.send('🛠️ This command is **under construction** 🏗️').catch(console.error));
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
     * The type property of a command determines where the command can be called,
     * either in a DM channel, Guild channel or both
     * @param type
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
     * setCallback((message, args, client) => message.reply('pong!'));
     *
     * setCallback(function(message, args, client) {
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
            if (!(parameter instanceof Parameter_js_1.Parameter))
                return this.addParameters(new Parameter_js_1.Parameter(parameter));
            const { required, caseSensitive, key } = parameter;
            if (!key)
                throw new Error('Command parameters must have a key set.');
            parameter.choices.filter(choice => typeof choice === 'string');
            parameter.setRequired(typeof required === 'boolean' ? required : true);
            parameter.setCaseSensitive(typeof caseSensitive === 'boolean' ? caseSensitive : true);
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
        aliases.map(i => typeof i !== 'string' && util_js_1.isIterable(i) ? [...i] : i).flat().filter(alias => typeof alias === 'string').forEach(alias => this.aliases.add(alias));
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
            throw new TypeError(`Type '${typeof properties}' does not conform to type 'CommandOptions'.`);
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
        if (parameters && util_js_1.isIterable(parameters))
            this.addParameters(parameters);
        if (aliases && util_js_1.isIterable(aliases))
            this.addAliases(aliases);
        return this;
    }
}
exports.Command = Command;
exports.default = Command;
