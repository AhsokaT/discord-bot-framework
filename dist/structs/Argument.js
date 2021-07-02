"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
class Argument {
    value;
    type;
    parameter;
    constructor(value, type, parameter) {
        this.value = value;
        this.type = type;
        this.parameter = parameter;
        this.parameter = parameter;
        this.value = value;
        this.type = type;
    }
    isMember() {
        return this.type === 'Member';
    }
    isRole() {
        return this.type === 'Role';
    }
    isChannel() {
        return this.type === 'Channel';
    }
    isUser() {
        return this.type === 'User';
    }
    isBoolean() {
        return this.type === 'Boolean';
    }
    isNumber() {
        return this.type === 'Number';
    }
    isString() {
        return this.type === 'String';
    }
}
exports.Argument = Argument;
exports.default = Argument;
