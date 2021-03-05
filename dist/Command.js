"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
function isCommandOptions(object) {
    return 'name' in object && 'callback' in object;
}
class Command {
    constructor(options) {
        if (!isCommandOptions(options))
            throw new Error('Argument for \'options\' did not conform to interface \'CommandOptions\'');
        this.#name = options.name;
        this.#callback = options.callback;
        this.#description = options.description ?? '';
        this.#parameters = options.parameters?.sort((a, b) => a.required && b.required === false ? -1 : 0) ?? [];
        this.#category = options.category ?? '';
        this.#permissions = options.permissions ?? [];
    }
    #name;
    #description;
    #parameters;
    #callback;
    #category;
    #permissions;
    edit(options) {
        for (const param in options) {
            if (param in this)
                this[param] = options[param];
        }
    }
    get name() {
        return this.#name;
    }
    // set name(name) {
    //     if (typeof name !== 'string') return;
    //     this.#name = name;
    // }
    get description() {
        return this.#description;
    }
    set description(description) {
        if (typeof description !== 'string')
            return;
        this.#description = description;
    }
}
exports.Command = Command;
