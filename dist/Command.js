"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(options) {
        if (!('name' in options || 'callback' in options))
            throw new Error('Argument for \'options\' did not conform to interface \'CommandOptions\'');
        this.#name = options.name;
        this.#aliases = options.aliases ?? [];
        this.#callback = options.callback;
        this.#description = options.description ?? '';
        this.#parameters = options.parameters?.sort((a, b) => a.required && b.required === false ? -1 : 0) ?? [];
        this.#category = options.category ?? '';
        this.#permissions = typeof options.permissions === 'string' ? [options.permissions] : [];
    }
    #name;
    #aliases;
    #description;
    #parameters;
    #callback;
    #category;
    #permissions;
    /**
     * Edit the properties of this command
     */
    edit(options) {
        for (const param in options) {
            if (param in this && !param.startsWith('#')) {
                this[param] = options[param];
            }
        }
        return this;
    }
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
