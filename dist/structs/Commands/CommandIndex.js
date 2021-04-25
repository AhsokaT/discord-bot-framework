"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_js_1 = require("./Command.js");
const helpCommand_js_1 = require("../../util/helpCommand.js");
const extensions_js_1 = require("../../util/extensions.js");
class CommandIndex {
    constructor(client, options = {}) {
        this.client = client;
        const { prefix, permissions, groups, allowBots, automaticMessageParsing } = options;
        this.index = new extensions_js_1.Index();
        this.allowBots = Boolean(allowBots);
        this.groups = Array.isArray(groups) ? new extensions_js_1.Group(groups) : new extensions_js_1.Group();
        this.permissions = Array.isArray(permissions) ? permissions : [];
        this.prefix = typeof prefix === 'string' ? prefix : '';
        if (automaticMessageParsing ?? true)
            this.client.on('message', this.client.parseMessage);
    }
    /**
     * @param prefix A command prefix the bot should look for
     */
    setPrefix(prefix) {
        if (typeof prefix === 'string')
            this.prefix = prefix;
        return this;
    }
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     */
    indexCommand(command) {
        return this.indexCommands(command);
    }
    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     */
    indexCommands(...commands) {
        commands.forEach(command => {
            if (!(command instanceof Command_js_1.default))
                return this.indexCommands(new Command_js_1.default(command));
            if (!command.name)
                throw new Error('A command must have a name set.');
            if (!command.callback)
                throw new Error('A commands must have a callback set.');
            if (command.group && !this.groups.has(command.group))
                throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroup(\'${command.group}\')`);
            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.includes(alias))
                        throw new Error(`Alias \'${alias}\' already exists on command \'${existing.name}\'`);
                });
            });
            this.index.set(command.name, command);
        });
        return this;
    }
    indexDefaults() {
        this.indexCommand(helpCommand_js_1.default);
        return this;
    }
    indexGroup(group) {
        return this.indexGroups(group);
    }
    indexGroups(...groups) {
        groups.forEach(group => {
            if (typeof group === 'string')
                this.groups.add(group);
        });
        return this;
    }
    removeCommands(...commands) {
        commands.forEach(command => this.index.delete(command instanceof Command_js_1.default ? command.name : command));
        return this;
    }
    removeGroup(group) {
        return this.removeGroups(group);
    }
    removeGroups(...groups) {
        groups.forEach(group => this.groups.delete(group));
        return this;
    }
}
exports.default = CommandIndex;
