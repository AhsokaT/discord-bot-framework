"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.isIterable = exports.noop = exports.toString = exports.toList = void 0;
/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
function toList(items, trailingConnective = 'and') {
    return `${items.length > 1 ? `${items.slice(0, items.length - 1).join(', ')} ${trailingConnective} ${items[items.length - 1]}` : items}`;
}
exports.toList = toList;
/**
 * Convert any value to a string
 * @param value
 */
function toString(value) {
    return `${value}`;
}
exports.toString = toString;
/**
 * No-operation
 */
function noop() {
    // noop
}
exports.noop = noop;
function isIterable(obj) {
    return typeof obj[Symbol.iterator] === 'function';
}
exports.isIterable = isIterable;
function toArray(obj) {
    return [...obj];
}
exports.toArray = toArray;
