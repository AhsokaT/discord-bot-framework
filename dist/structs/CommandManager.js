"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_js_1 = require("./Command.js");
const helpCommand_js_1 = require("../util/helpCommand.js");
const js_augmentations_1 = require("js-augmentations");
class CommandManager {
    constructor(client, options = {}) {
        this.client = client;
        this.client = client;
        const { prefix, permissions, allowBots, automaticMessageParsing } = options;
        this.index = new js_augmentations_1.Index();
        this.groups = new js_augmentations_1.Collection();
        this.permissions = new js_augmentations_1.Collection();
        this.allowBots = Boolean(allowBots);
        this.setPrefix(typeof prefix === 'string' ? prefix : '');
        if (Array.isArray(permissions))
            this.permissions.array().filter(perm => typeof perm === 'string').forEach(this.permissions.add);
        if (automaticMessageParsing ?? true)
            this.client.on('message', this.client.parseMessage);
    }
    /**
     * @param prefix A command prefix the bot should discriminate messages with
     * @example
     * setPrefix('$');
     */
    setPrefix(prefix) {
        if (typeof prefix === 'string')
            this.prefix = prefix;
        return this;
    }
    /**
     * Add a new command to the bot; if provided name matches an existing command, the existing command will be overwritten
     * @param command An instance of the Command class or an object conforming to type CommandDetails
     * @example
     * const command = new Command()
     *      .setName('name')
     *      .setDescription('description')
     *
     * indexCommand(command);
     */
    indexCommand(command) {
        return this.indexCommands(command);
    }
    /**
     * Add new commands to the bot; if provided commands match existing commands, the existing commands will be overwritten
     * @param commands Instances of the Command class or objects conforming to type CommandDetails
     * @example
     * const ping = new Command()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     *
     * const purge = new Command()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     *
     * indexCommands(ping, purge);
     */
    indexCommands(...commands) {
        commands.flat().forEach(command => {
            if (!(command instanceof Command_js_1.default))
                return this.indexCommands(new Command_js_1.default(command));
            if (!command.name)
                throw new Error('A command must have a name set.');
            if (command.group && !this.groups.has(command.group))
                throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroups(\'${command.group}\')`);
            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.has(alias))
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
    indexGroup(name) {
        return this.indexGroups(name);
    }
    indexGroups(...groups) {
        const entries = groups.flat().filter(group => typeof group === 'string');
        entries.forEach(group => this.groups.add(group));
        return this;
    }
    deleteCommands(...commands) {
        commands.forEach(command => {
            const toDelete = command instanceof Command_js_1.default ? command : this.index.get(command);
            if (toDelete)
                this.index.delete(toDelete.name);
        });
        return this;
    }
    deleteGroup(group) {
        return this.deleteGroups(group);
    }
    deleteGroups(...groups) {
        groups.flat().forEach(group => this.groups.delete(group));
        return this;
    }
}
exports.default = CommandManager;
