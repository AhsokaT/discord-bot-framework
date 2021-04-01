"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(info) {
        this.#nsfw = false;
        this.#aliases = [];
        this.#parameters = [];
        this.#permissions = [];
        if (info)
            this.edit(info);
    }
    #name;
    #description;
    #category;
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
    get parameters() {
        return this.#parameters;
    }
    get nsfw() {
        return this.#nsfw;
    }
    get category() {
        return this.#category;
    }
    get permissions() {
        return this.#permissions;
    }
    get aliases() {
        return this.#aliases;
    }
    get callback() {
        return this.#callback;
    }
    /**
     * @param name The name of your command
     */
    setName(name) {
        if (name && typeof name === 'string')
            this.#name = name;
        return this;
    }
    /**
     * @param description A short description of your command
     */
    setDescription(description) {
        if (description && typeof description === 'string')
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
     * @param category The category of commands this command belongs to
     */
    setCategory(category) {
        if (category && typeof category === 'string')
            this.#category = category.toLowerCase();
        return this;
    }
    /**
     * @param callback The function to be executed when this command is invoked
     * @example
     * setCallback((message, client, args) => message.reply('pong!'));
     */
    setCallback(callback) {
        if (typeof callback === 'function')
            this.#callback = callback;
        return this;
    }
    /**
     * @param name
     * @param description
     * @param type
     * @param wordCount
     * @param required
     * @param choices
     * @example
     * addParameter('id', 'The ID of a member');
     */
    addParameter(name, description, type, wordCount, required, choices) {
        this.addParameters({
            name,
            description,
            type,
            wordCount,
            required,
            choices
        });
        return this;
    }
    /**
     * @param parameters Parameter(s) this command accepts
     * @example
     * addParameters({ name: 'id', description: 'The ID of a member' }, { name: 'role', description: 'The ID of a role' });
     */
    addParameters(...parameters) {
        if (Array.isArray(parameters))
            parameters.forEach(parameter => {
                if (typeof parameter !== 'object')
                    throw new TypeError('\'parameter\' must be an object of type \'ParameterType\'.');
                const { name, description, choices, wordCount, type, required } = parameter;
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
                this.#parameters.push(parameter);
                this.#parameters.sort((a, b) => a.required && !b.required ? -1 : 0);
            });
        return this;
    }
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     */
    addPermissions(...permissions) {
        if (Array.isArray(permissions))
            this.#permissions.push(...permissions.filter(perm => typeof perm === 'string'));
        return this;
    }
    /**
     * @param alias Alternative name(s) this command can be called by
     * @example
     * addAlias('purge', 'bulkdelete');
     */
    addAlias(...alias) {
        if (Array.isArray(alias))
            this.#aliases.push(...alias.filter(alias => typeof alias === 'string'));
        return this;
    }
    /**
     * Edit the properties of this command
     * @param info Object containing new properties
     * @example
     * edit({ name: 'purge', description: 'Deletes messages' });
     */
    edit(info) {
        if (typeof info !== 'object')
            throw new TypeError('Parameter for \'info\' must be of type \'CommandInfo\'.');
        const { name, description, category, callback, permissions, parameters, nsfw, aliases } = info;
        if (name)
            this.setName(name);
        if (description)
            this.setDescription(description);
        if (category)
            this.setCategory(category);
        if (callback)
            this.setCallback(callback);
        if (typeof nsfw === 'boolean')
            this.setNSFW(nsfw);
        if (Array.isArray(permissions))
            this.addPermissions(...permissions);
        if (Array.isArray(parameters))
            this.addParameters(...parameters);
        if (Array.isArray(aliases))
            this.addAlias(...aliases);
        return this;
    }
}
exports.Command = Command;
