"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
class SlashSubCommandGroup {
    name;
    description;
    commands;
    constructor() {
        this.commands = new js_augmentations_1.Collection();
    }
    get data() {
        return;
    }
}
