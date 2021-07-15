"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
class SlashSubCommandGroup {
    name;
    description;
    commands;
    guild;
    constructor() {
        this.guild = null;
        this.commands = new js_augmentations_1.Collection();
    }
    addCommands(...commands) {
        commands.forEach(command => {
            if (!command.name)
                throw new Error('Slash sub commands must have a name set.');
            if (!command.description)
                throw new Error('Slash sub commands must have a description set.');
            this.commands.add(command);
        });
        return this;
    }
    get data() {
        const { name, description, commands } = this;
        return { name, description, options: commands.map(({ data }) => data).array() };
    }
}
