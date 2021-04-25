"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = exports.Index = void 0;
class Index extends Map {
    constructor(...entries) {
        super(entries);
    }
    first() {
        return this.values().next()?.value;
    }
    array() {
        return [...this.values()];
    }
}
exports.Index = Index;
class Group extends Set {
    constructor(iterable) {
        super(iterable);
    }
    first() {
        return this.values().next()?.value;
    }
    array() {
        return [...this.values()];
    }
}
exports.Group = Group;
