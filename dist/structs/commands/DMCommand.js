"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCommand_js_1 = require("./BaseCommand.js");
class DMCommand extends BaseCommand_js_1.default {
    constructor(properties) {
        super(properties);
    }
    setCallback(callback) {
        return super.setCallback(callback);
    }
    edit(properties) {
        return super.edit(properties);
    }
}
exports.default = DMCommand;
