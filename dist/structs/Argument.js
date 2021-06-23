"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argument = void 0;
class Argument {
    constructor(value, type) {
        this.value = value;
        this.type = type;
        this.value = value;
        this.type = type;
    }
    isMember() {
        return this.type === 'member';
    }
    isRole() {
        return this.type === 'role';
    }
    isChannel() {
        return this.type === 'channel';
    }
    isUser() {
        return this.type === 'user';
    }
    isBoolean() {
        return this.type === 'boolean';
    }
    isNumber() {
        return this.type === 'number';
    }
    isString() {
        return this.type === 'string';
    }
}
exports.Argument = Argument;
exports.default = Argument;
