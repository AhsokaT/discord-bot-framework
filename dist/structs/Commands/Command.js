"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    /**
     * @param {CommandDetails} details
     */
    constructor(details) {
        this.#details = {
            name: '',
            description: '',
            group: '',
            nsfw: false,
            aliases: [],
            permissions: [],
            parameters: [],
            callback: () => { }
        };
        if (details)
            this.edit(details);
    }
    #details;
    get name() {
        return this.#details.name;
    }
    get description() {
        return this.#details.description;
    }
    get aliases() {
        return this.#details.aliases;
    }
    get permissions() {
        return this.#details.permissions;
    }
    get callback() {
        return this.#details.callback;
    }
    get group() {
        return this.#details.group;
    }
    get parameters() {
        return this.#details.parameters;
    }
    get nsfw() {
        return this.#details.nsfw;
    }
    /**
     * @param name The name of your command
     */
    setName(name) {
        if (typeof name === 'string')
            this.#details.name = name;
        return this;
    }
    /**
     * @param description A short description of your command
     */
    setDescription(description) {
        if (typeof description === 'string')
            this.#details.description = description;
        return this;
    }
    /**
     * @param nsfw Whether the command should only be usable in NSFW channels; true by default
     */
    setNSFW(nsfw = true) {
        this.#details.nsfw = Boolean(nsfw);
        return this;
    }
    /**
     * @param group The group of commands this command belongs to
     */
    setGroup(group) {
        if (typeof group === 'string')
            this.#details.group = group;
        return this;
    }
    /**
     * @param callback The function to be executed when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     */
    setCallback(callback) {
        if (typeof callback === 'function')
            this.#details.callback = callback;
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
        parameters.forEach(parameter => {
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
            this.#details.parameters.push(parameter);
            this.#details.parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
        });
        return this;
    }
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    addPermissions(...permissions) {
        this.#details.permissions.push(...permissions.filter(perm => typeof perm === 'string'));
        return this;
    }
    /**
     * @param aliases Alternative name(s) this command can be called by
     * @example
     * addAliases('prune');
     * addAliases('purge', 'bulkdelete');
     */
    addAliases(...aliases) {
        this.#details.aliases.push(...aliases.filter(alias => typeof alias === 'string'));
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
