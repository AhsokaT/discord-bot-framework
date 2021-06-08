"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_augmentations_1 = require("js-augmentations");
const BaseCommand_js_1 = require("./BaseCommand.js");
class GuildCommand extends BaseCommand_js_1.default {
    constructor(properties) {
        super(properties);
        this.permissions = new js_augmentations_1.Collection();
    }
    /**
     * @param permissions Permission(s) this command requires to run
     * @example
     * addPermissions('MANAGE_CHANNELS');
     * addPermissions('BAN_MEMBERS', 'KICK_MEMBERS', 'MANAGE_MESSAGES');
     * addPermissions('BAN_MEMBERS', ['KICK_MEMBERS', 'MANAGE_MESSAGES']);
     */
    addPermissions(...permissions) {
        permissions.flat().forEach(permission => this.permissions.add(permission));
        return this;
    }
    setCallback(callback) {
        return super.setCallback(callback);
    }
    edit(properties) {
        return super.edit(properties);
    }
}
exports.default = GuildCommand;
