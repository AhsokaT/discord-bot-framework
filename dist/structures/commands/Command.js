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
    toObject() {
        return {
            name: this.name,
            description: this.description,
            nsfw: this.nsfw,
            category: this.category,
            aliases: this.aliases,
            parameters: this.parameters,
            permissions: this.permissions,
            callback: this.callback,
        };
    }
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
     * @param nsfw Whether the command should only be usable in NSFW channels; false by default
     */
    setNSFW(nsfw) {
        this.#nsfw = Boolean(nsfw);
        return this;
    }
    /**
     * @param category The category of commands this command belongs to
     */
    setCategory(category) {
        if (category && typeof category === 'string')
            this.#category = category;
        return this;
    }
    setCallback(callback) {
        if (typeof callback === 'function')
            this.#callback = callback;
        return this;
    }
    /**
     * @param parameter Parameter(s) this command accepts
     */
    addParameter(parameter) {
        if (!parameter)
            return this;
        if (Array.isArray(parameter)) {
            parameter.forEach(param => this.addParameter(param));
            return this;
        }
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
        return this;
    }
    /**
     * @param permission Permission(s) this command requires to run
     */
    addPermission(permission) {
        if (Array.isArray(permission)) {
            permission.forEach(perm => this.addPermission(perm));
            return this;
        }
        if (typeof permission !== 'string')
            return this;
        this.#permissions.push(permission);
        return this;
    }
    /**
     * @param alias Alternative name(s) this command can be called by
     */
    addAlias(alias) {
        if (Array.isArray(alias)) {
            alias.forEach(i => this.addAlias(i));
            return this;
        }
        if (typeof alias !== 'string')
            return this;
        this.#aliases.push(alias);
        return this;
    }
    /**
     * Edit the properties of this command
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
            this.addPermission(permissions);
        if (Array.isArray(parameters))
            this.addParameter(parameters);
        if (Array.isArray(aliases))
            this.addAlias(aliases);
        return this;
    }
}
exports.Command = Command;
