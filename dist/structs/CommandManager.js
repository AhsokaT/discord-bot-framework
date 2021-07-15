"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const helpCommand_js_1 = require("../util/helpCommand.js");
const js_augmentations_1 = require("js-augmentations");
const Command_js_1 = require("./Command.js");
const util_js_1 = require("../util/util.js");
const ParameterType_js_1 = require("./ParameterType.js");
class CommandManager {
    client;
    prefix;
    allowBots;
    groups;
    index;
    types;
    permissions;
    promptUserForInput;
    constructor(client, options = {}) {
        this.client = client;
        this.client = client;
        const { prefix, permissions, allowBots, automaticMessageParsing, promptUserForInput } = options;
        this.index = new js_augmentations_1.Index();
        this.types = new js_augmentations_1.Index();
        this.groups = new js_augmentations_1.Collection();
        this.permissions = new js_augmentations_1.Collection();
        this.allowBots = Boolean(allowBots);
        this.promptUserForInput = typeof promptUserForInput === 'boolean' ? promptUserForInput : true;
        this.setPrefix(prefix ?? '');
        if (permissions && util_js_1.isIterable(permissions))
            this.permissions.push(...permissions);
        if (automaticMessageParsing ?? true)
            this.client.on('messageCreate', this.client.parseMessage);
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
    indexType(type) {
        return this.indexTypes(type);
    }
    indexTypes(...types) {
        types.map(i => util_js_1.isIterable(i) ? [...i] : i).flat().forEach(type => {
            if (!type.key)
                throw new Error('ParameterTypes must have a key set.');
            if (!type.predicate)
                throw new Error('ParameterTypes must have a predicate set.');
            this.types.set(type.key, type instanceof ParameterType_js_1.default ? type : new ParameterType_js_1.default(type));
        });
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
            if (!(command instanceof Command_js_1.default))
                return this.indexCommands(new Command_js_1.default(command));
            if (!command.name)
                throw new Error('A command must have a name set.');
            if (command.group && !this.groups.has(command.group))
                throw new Error(`There is not existing command group named \'${command.group}\'; use .indexGroups(\'${command.group}\')`);
            command.aliases.forEach(alias => {
                this.index.forEach(({ aliases, name }) => {
                    if (aliases.has(alias))
                        throw new Error(`Alias '${alias}' already exists on command '${name}'`);
                });
            });
            command.parameters.forEach(({ type }) => {
                if (type && !this.types.get(type) && !['String', 'Number', 'Boolean', 'User', 'Member', 'Channel', 'Role'].includes(type))
                    throw new Error(`There is no ParameterType with key '${type}'`);
            });
            this.index.set(command.name, command);
        });
        return this;
    }
    indexDefaults() {
        this.indexCommands(helpCommand_js_1.default);
        return this;
    }
    // public indexGroup(group: CommandGroup): this {
    //     return this.indexGroups(group);
    // }
    indexGroups(...groups) {
        groups.flat().map(item => typeof item !== 'string' && util_js_1.isIterable(item) ? [...item] : item).flat().forEach(group => this.groups.add(group));
        return this;
    }
    deleteCommands(...commands) {
        commands.flat().map(item => typeof item !== 'string' && util_js_1.isIterable(item) ? [...item] : item).flat().forEach(command => {
            let toDelete;
            if (command instanceof Command_js_1.default)
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
