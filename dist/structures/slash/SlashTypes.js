"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashArguments = exports.SlashArgument = exports.ApplicationCommandOptionType = void 0;
var ApplicationCommandOptionType;
(function (ApplicationCommandOptionType) {
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND"] = 1] = "SUB_COMMAND";
    ApplicationCommandOptionType[ApplicationCommandOptionType["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
    ApplicationCommandOptionType[ApplicationCommandOptionType["STRING"] = 3] = "STRING";
    ApplicationCommandOptionType[ApplicationCommandOptionType["INTEGER"] = 4] = "INTEGER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["BOOLEAN"] = 5] = "BOOLEAN";
    ApplicationCommandOptionType[ApplicationCommandOptionType["USER"] = 6] = "USER";
    ApplicationCommandOptionType[ApplicationCommandOptionType["CHANNEL"] = 7] = "CHANNEL";
    ApplicationCommandOptionType[ApplicationCommandOptionType["ROLE"] = 8] = "ROLE";
})(ApplicationCommandOptionType = exports.ApplicationCommandOptionType || (exports.ApplicationCommandOptionType = {}));
class SlashArgument {
    constructor(options) {
        this.name = options.name;
        this.value = options.value;
        this.type = ApplicationCommandOptionType[options.type];
        if (options.options)
            this.options = options.options;
    }
}
exports.SlashArgument = SlashArgument;
class SlashArguments {
    constructor(args) {
        this.args = [];
        if (Array.isArray(args))
            this.args = args;
    }
    /**
     * @param name Name of your parameter
     * @returns The user input
     */
    get(name) {
        return this.args.find(arg => arg.name === name);
    }
    /**
     * @returns The first user input
     */
    first() {
        return this.args[0];
    }
    all() {
        return this.args;
    }
}
exports.SlashArguments = SlashArguments;
