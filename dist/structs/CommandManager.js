"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const helpCommand_js_1 = require("../util/helpCommand.js");
const js_augmentations_1 = require("js-augmentations");
const Prototype_js_1 = require("./Prototype.js");
const util_js_1 = require("../util/util.js");
class CommandManager {
    constructor(client, options = {}) {
        this.client = client;
        this.client = client;
        const { prefix, permissions, allowBots, automaticMessageParsing, promptUserForInput } = options;
        this.index = new js_augmentations_1.Index();
        this.groups = new js_augmentations_1.Collection();
        this.permissions = new js_augmentations_1.Collection();
        this.allowBots = Boolean(allowBots);
        this.promptUserForInput = typeof promptUserForInput === 'boolean' ? promptUserForInput : true;
        this.setPrefix(typeof prefix === 'string' ? prefix : '');
        if (Array.isArray(permissions))
            this.permissions.push(...permissions);
        if (automaticMessageParsing ?? true)
            this.client.on('message', this.client.parseMessage);
    }
    *[Symbol.iterator]() {
        yield* this.index.array();
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
     * const ping = new UniversalCommand()
     *      .setName('ping')
     *      .setDescription('Ping pong');
     *
     * const purge = new GuildCommand()
     *      .setName('purge')
     *      .setDescription('Delete messages');
     *
     * indexCommands(ping, purge);
     */
    indexCommands(...commands) {
        commands.map(item => util_js_1.isIterable(item) ? [...item] : item).flat().forEach(command => {
            if (!(command instanceof Prototype_js_1.default))
                return this.indexCommands(new Prototype_js_1.default(command));
            if (!command.name)
                throw new Error('A command must have a name set.');
            if (command.group && !this.groups.has(command.group))
                throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroups(\'${command.group}\')`);
            command.aliases.forEach(alias => {
                this.index.forEach(existing => {
                    if (existing.aliases.has(alias))
                        throw new Error(`Alias '${alias}' already exists on command '${existing.name}'`);
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
        const entries = groups.flat().map(item => typeof item !== 'string' && util_js_1.isIterable(item) ? [...item] : item).flat().filter(group => typeof group === 'string');
        entries.forEach(group => this.groups.add(group));
        return this;
    }
    deleteCommands(...commands) {
        commands.flat().map(item => typeof item !== 'string' && util_js_1.isIterable(item) ? [...item] : item).flat().forEach(command => {
            let toDelete;
            if (command instanceof Prototype_js_1.default)
                toDelete = command;
            else
                toDelete = this.index.get(typeof command === 'string' ? command : command.name);
            if (toDelete)
                this.index.delete(toDelete.name);
        });
        return this;
    }
    deleteGroup(group) {
        return this.deleteGroups(group);
    }
    deleteGroups(...groups) {
        groups.flat().map(item => typeof item !== 'string' && util_js_1.isIterable(item) ? [...item] : item).flat().forEach(group => this.groups.delete(group));
        return this;
    }
}
exports.CommandManager = CommandManager;
exports.default = CommandManager;
