"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = exports.Index = void 0;
/**
 * An extension of the JavaScript Map that provides additional utility methods.
 * @class
 * @extends {Map}
 */
class Index extends Map {
    constructor(entries) {
        super(entries);
    }
    /**
     * Creates a new Index with all the elements of this Index and returns it.
     */
    clone() {
        return new this.constructor[Symbol.species]([...this]);
    }
    /**
     * Returns the index of the last occurrence of a specified value in an Index, or undefined if it is not present.
     * @param searchElement The value to locate in the Index.
     */
    lastKeyOf(searchElement) {
        return this.clone().reverse().keyOf(searchElement);
    }
    /**
     * Identical in behaviour to [Array.unshift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
     *
     * Reverses the elements in an Index in place. This method mutates the Index and returns a reference to the same Index.
     */
    reverse() {
        const reversed = this.entryArray().reverse();
        this.clear();
        this.push(...reversed);
        return this;
    }
    /**
     * Identical in behaviour to [Array.push();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
     *
     * Appends new elements to the end of an Index, and returns the new length of the Index.
     * @param items New elements to add to the Index.
     */
    push(...items) {
        items.forEach(item => this.set(item[0], item[1]));
        return this.size;
    }
    /**
     * Identical in behaviour to [Array.unshift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
     *
     * Inserts new elements at the start of an Index, and returns the new length of the Index.
     * @param items Elements to insert at the start of the Index.
     */
    unshift(...items) {
        const entries = [...items, ...this];
        this.clear();
        this.push(...entries);
        return this.size;
    }
    /**
     * Identical in behaviour to [Array.shift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
     *
     * Removes the first element from an Index and returns it. If the Index is empty, undefined is returned and the Index is not modified.
     */
    shift() {
        const entry = this.entryArray().shift();
        if (!entry)
            return;
        this.delete(entry[0]);
        return entry[1];
    }
    /**
     * Identical in behaviour to [Array.pop();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
     *
     * Removes the last element from an Index and returns it. If the Index is empty, undefined is returned and the Index is not modified.
     */
    pop() {
        const entry = this.entryArray().pop();
        if (!entry)
            return;
        this.delete(entry[0]);
        return entry[1];
    }
    /**
     * Identical in behaviour to [Array.join();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
     *
     * Adds all the elements of an array into a string, separated by the specified separator string.
     * @param separator A string used to separate one element of the Index from the next in the resulting string. If omitted, the Index elements are separated with a comma.
     */
    join(separator = ',') {
        return this.array().join(separator);
    }
    /**
     * Similar in behaviour to [Array.indexOf();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
     *
     * Returns the index of the first occurrence of a value in an Index, or undefined if it is not present.
     * @param searchElement The value to locate in the Index.
     */
    keyOf(searchElement) {
        return this.findKey(val => val === searchElement);
    }
    every(predicate, thisArg) {
        if (typeof predicate !== 'function')
            throw new TypeError(`${typeof predicate} is not a function`);
        if (thisArg)
            predicate.bind(thisArg);
        for (const [key, val] of this) {
            if (!predicate(val, key, this))
                return false;
        }
        return true;
    }
    /**
     * Identical in behaviour to [Array.map();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     *
     * Calls a defined callback function on each element of the Index, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Index.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn, thisArg) {
        if (typeof callbackfn !== 'function')
            throw new TypeError(`${typeof callbackfn} is not a function`);
        if (thisArg)
            callbackfn.bind(thisArg);
        const entries = this.entries();
        return Array.from({ length: this.size }, () => {
            const [key, value] = entries.next().value;
            return callbackfn(value, key, this);
        });
    }
    /**
     * Identical in behaviour to [Array.filter();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
     *
     * Returns the elements of an Index that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the Index.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate, thisArg) {
        if (typeof predicate !== 'function')
            throw new TypeError(`${typeof predicate} is not a function`);
        if (thisArg)
            predicate.bind(thisArg);
        this.forEach((val, key, index) => {
            if (!predicate(val, key, index))
                this.delete(key);
        });
        return this;
    }
    /**
     * Identical in behaviour to [Array.concat();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
     *
     * Combines two or more Indexes.
     * This method returns a new Index without modifying any existing Indexes.
     * @param indexes Additional Indexes and/or items to add to the end of the array.
     */
    concat(...indexes) {
        const entries = indexes.flat().filter(i => i instanceof Index).map(i => [...i]).flat();
        return new this.constructor[Symbol.species]([...this, ...entries]);
    }
    /**
     * Identical in behaviour to [Array.find();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     * @param predicate find calls predicate once for each element of the Index, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
     */
    find(predicate, thisArg) {
        if (typeof predicate !== 'function')
            throw new TypeError(`${typeof predicate} is not a function`);
        if (thisArg)
            predicate.bind(thisArg);
        for (const [key, val] of this) {
            if (predicate(val, key, this))
                return val;
        }
    }
    /**
     * Identical in behaviour to [Array.find();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     * @param predicate find calls predicate once for each element of the Index, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element key. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
     */
    findKey(predicate, thisArg) {
        if (typeof predicate !== 'function')
            throw new TypeError(`${typeof predicate} is not a function`);
        if (thisArg)
            predicate.bind(thisArg);
        for (const [key, val] of this) {
            if (predicate(val, key, this))
                return key;
        }
    }
    /**
     * Identical in behaviour to [Array.sort();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
     * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * @example
     * sort((a, b) => a - b);
     */
    sort(compareFn = (a, b) => Number(a) - Number(b)) {
        if (typeof compareFn !== 'function')
            throw new TypeError(`${typeof compareFn} is not a function`);
        const entries = this.entryArray();
        entries.sort((a, b) => compareFn(a[1], b[1], a[0], b[0]));
        this.clear();
        entries.forEach(entry => this.set(entry[0], entry[1]));
        return this;
    }
    first(amount) {
        if (typeof amount === 'undefined')
            return this.values().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        return this.array().slice(0, amount);
    }
    firstKey(amount) {
        if (typeof amount === 'undefined')
            return this.keys().next().value;
        if (amount < 0)
            return this.last(amount * -1);
        return this.keyArray().slice(0, amount);
    }
    firstEntry(amount) {
        if (typeof amount === 'undefined')
            return this.entries().next().value;
        if (amount < 0)
            return this.lastEntry(amount * -1);
        return this.entryArray().slice(0, amount);
    }
    lastEntry(amount) {
        const array = this.entryArray();
        if (typeof amount === 'undefined')
            return array[array.length - 1];
        if (amount < 0)
            return this.firstEntry(amount * -1);
        if (amount > 0)
            return array.slice(-amount);
        return;
    }
    lastKey(amount) {
        const array = this.keyArray();
        if (typeof amount === 'undefined')
            return array[array.length - 1];
        if (amount < 0)
            return this.firstKey(amount * -1);
        if (amount > 0)
            return array.slice(-amount);
        return;
    }
    last(amount) {
        const array = this.array();
        if (typeof amount === 'undefined')
            return array[array.length - 1];
        if (amount < 0)
            return this.first(amount * -1);
        if (amount > 0)
            return array.slice(-amount);
        return;
    }
    random(amount) {
        const array = this.array();
        if (typeof amount === 'undefined' || amount === 1)
            return array[Math.floor(Math.random() * array.length)];
        return amount > 1 ? Array.from({ length: amount }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]) : [];
    }
    randomKey(amount) {
        const array = this.keyArray();
        if (typeof amount === 'undefined')
            return array[Math.floor(Math.random() * array.length)];
        return amount > 0 ? Array.from({ length: amount }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]) : [];
    }
    randomEntry(amount) {
        const array = this.entryArray();
        if (typeof amount === 'undefined' || amount === 1)
            return array[Math.floor(Math.random() * array.length)];
        return amount > 1 ? Array.from({ length: amount }, () => array.splice(Math.floor(Math.random() * array.length), 1)[0]) : [];
    }
    forEach(callbackfn, thisArg) {
        super.forEach(callbackfn, thisArg);
    }
    array() {
        return [...this.values()];
    }
    keyArray() {
        return [...this.keys()];
    }
    entryArray() {
        return [...this.entries()];
    }
}
exports.Index = Index;
class Collection extends Set {
    constructor(iterable) {
        super(iterable);
    }
    /**
     * Identical in behaviour to [Array.map();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Collection.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn, thisArg) {
        if (!callbackfn || typeof callbackfn !== 'function')
            return [];
        if (thisArg)
            callbackfn.bind(thisArg);
        const array = this.array();
        const values = this.values();
        return Array.from({ length: this.size }, () => {
            const value = values.next().value;
            return callbackfn(value, array.indexOf(value), this);
        });
    }
    /**
     * Identical in behaviour to [Array.sort();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
     * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn = (a, b) => Number(a) - Number(b)) {
        const array = this.array();
        array.sort((a, b) => compareFn(a, b));
        this.clear();
        array.forEach(val => this.add(val));
        return this;
    }
    array() {
        return [...this.values()];
    }
}
exports.Collection = Collection;
