"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
class CommandManager {
    constructor(options) {
        if (options?.categories)
            this.#categories = options.categories;
    }
    #commands;
    #categories;
}
exports.CommandManager = CommandManager;
