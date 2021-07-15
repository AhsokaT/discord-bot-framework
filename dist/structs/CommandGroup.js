"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
const Command_js_1 = require("./Command.js");
class CommandGroup {
    key;
    label;
    description;
    commands;
    constructor(options) {
        this.commands = new js_augmentations_1.Collection();
        if (options)
            this.repair(options);
    }
    repair({ key, label, description, commands }) {
        if (key)
            this.setKey(key);
        if (label)
            this.setLabel(label);
        if (description)
            this.setDescription(description);
        if (commands && util_js_1.isIterable(commands))
            this.addCommands(...commands);
        return this;
    }
    setKey(key) {
        if (typeof key !== 'string')
            throw new TypeError(`Type ${typeof key} is not assignable to type 'string'.`);
        this.key = key;
        if (!this.label)
            this.label = this.key;
        return this;
    }
    setLabel(label) {
        if (typeof label !== 'string')
            throw new TypeError(`Type ${typeof label} is not assignable to type 'string'.`);
        this.label = label;
        return this;
    }
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);
        this.description = description;
        return this;
    }
    addCommands(...commands) {
        commands.map(item => util_js_1.isIterable(item) ? [...item] : item).flat().forEach(command => this.commands.add(new Command_js_1.default(command)));
        return this;
    }
}
exports.default = CommandGroup;
