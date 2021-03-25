"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(options) {
        this.#description = '';
        this.#aliases = [];
        this.#parameters = [];
        this.#permissions = [];
        if (!options)
            return;
        const { name, description, category, permissions, parameters, aliases, callback } = options;
        if (callback)
            this.callback = callback;
        if (typeof name === 'string')
            this.name = name;
        if (typeof category === 'string')
            this.category = category;
        if (typeof description === 'string')
            this.description = description;
        if (Array.isArray(aliases))
            this.aliases = aliases;
        if (Array.isArray(permissions))
            this.#permissions = permissions;
        if (Array.isArray(parameters))
            this.parameters = parameters.map(i => {
                if (typeof i.required !== 'boolean')
                    i.required = true;
                return i;
            }).sort((a, b) => a.required && b.required === false ? -1 : 0);
    }
    #name;
    #description;
    #callback;
    #category;
    #aliases;
    #parameters;
    #permissions;
    /**
     * Edit the properties of this command
     */
    edit(options) {
        for (const param in options) {
            if (param in this && !param.startsWith('#'))
                this[param] = options[param];
        }
        return this;
    }
    // public isComplete(): this is Required<Command> {
    //     return true;
    // }
    get name() {
        return this.#name;
    }
    set name(name) {
        if (typeof name === 'string')
            this.#name = name;
    }
    get aliases() {
        return this.#aliases;
    }
    set aliases(aliases) {
        if (Array.isArray(aliases))
            this.#aliases = aliases;
    }
    get category() {
        return this.#category;
    }
    set category(category) {
        this.#category = category;
    }
    set callback(callback) {
        this.#callback = callback;
    }
    get callback() {
        return this.#callback;
    }
    get permissions() {
        return this.#permissions;
    }
    set permissions(permissions) {
        if (Array.isArray(permissions))
            this.#permissions = permissions;
    }
    get description() {
        return this.#description;
    }
    set description(description) {
        if (typeof description === 'string')
            this.#description = description;
    }
    get parameters() {
        return this.#parameters;
    }
    set parameters(parameters) {
        if (!Array.isArray(parameters))
            return;
        parameters.filter(i => !('name' in i));
        this.#parameters = parameters;
    }
}
exports.Command = Command;
