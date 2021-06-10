"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_js_1 = require("./Command.js");
class DMCommand extends Command_js_1.default {
    constructor(properties) {
        super(properties);
        this.type = 'DM';
    }
    setCallback(callback) {
        return super.setCallback(callback);
    }
    edit(properties) {
        return super.edit(properties);
    }
}
exports.default = DMCommand;
