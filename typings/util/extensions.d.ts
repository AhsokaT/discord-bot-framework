/**
 * An extension of the JavaScript Map that provides additional utility methods.
 * @class
 * @extends {Map}
 */
export declare class Index<K, V> extends Map<K, V> {
    constructor(entries?: readonly [K, V][]);
    /**
     * Creates a new Index with all the elements of this Index and returns it.
     */
    clone(): Index<K, V>;
    /**
     * Returns the index of the last occurrence of a specified value in an Index, or undefined if it is not present.
     * @param searchElement The value to locate in the Index.
     */
    lastKeyOf(searchElement: V): K | undefined;
    /**
     * Identical in behaviour to [Array.unshift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
     *
     * Reverses the elements in an Index in place. This method mutates the Index and returns a reference to the same Index.
     */
    reverse(): this;
    /**
     * Identical in behaviour to [Array.push();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
     *
     * Appends new elements to the end of an Index, and returns the new length of the Index.
     * @param items New elements to add to the Index.
     */
    push(...items: [K, V][]): number;
    /**
     * Identical in behaviour to [Array.unshift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
     *
     * Inserts new elements at the start of an Index, and returns the new length of the Index.
     * @param items Elements to insert at the start of the Index.
     */
    unshift(...items: [K, V][]): number;
    /**
     * Identical in behaviour to [Array.shift();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
     *
     * Removes the first element from an Index and returns it. If the Index is empty, undefined is returned and the Index is not modified.
     */
    shift(): V | undefined;
    /**
     * Identical in behaviour to [Array.pop();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
     *
     * Removes the last element from an Index and returns it. If the Index is empty, undefined is returned and the Index is not modified.
     */
    pop(): V | undefined;
    /**
     * Identical in behaviour to [Array.join();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
     *
     * Adds all the elements of an array into a string, separated by the specified separator string.
     * @param separator A string used to separate one element of the Index from the next in the resulting string. If omitted, the Index elements are separated with a comma.
     */
    join(separator?: string): string;
    /**
     * Similar in behaviour to [Array.indexOf();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
     *
     * Returns the index of the first occurrence of a value in an Index, or undefined if it is not present.
     * @param searchElement The value to locate in the Index.
     */
    keyOf(searchElement: V): K | undefined;
    /**
     * Identical in behaviour to [Array.every();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
     *
     * Determines whether all the members of an Index satisfy the specified test.
     * @param predicate A function that accepts up to three arguments. The every method calls the predicate function for each element in the Index until the predicate returns a value which is coercible to the Boolean value false, or until the end of the Index.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    every(predicate: (value: V, key: K, index: this) => boolean, thisArg?: any): boolean;
    /**
     * Identical in behaviour to [Array.map();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     *
     * Calls a defined callback function on each element of the Index, and returns an array that contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Index.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: V, key: K, index: this) => U, thisArg?: any): U[];
    /**
     * Identical in behaviour to [Array.filter();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
     *
     * Returns the elements of an Index that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the Index.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    filter(predicate: (value: V, key: K, index: this) => boolean, thisArg?: any): this;
    /**
     * Identical in behaviour to [Array.concat();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
     *
     * Combines two or more Indexes.
     * This method returns a new Index without modifying any existing Indexes.
     * @param indexes Additional Indexes and/or items to add to the end of the array.
     */
    concat(...indexes: ConcatIndex<K, V>[]): Index<K, V>;
    /**
     * Identical in behaviour to [Array.find();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     * @param predicate find calls predicate once for each element of the Index, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: V, key: K, index: this) => boolean, thisArg?: any): V | undefined;
    /**
     * Identical in behaviour to [Array.find();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)
     * @param predicate find calls predicate once for each element of the Index, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element key. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead.
     */
    findKey(predicate: (value: V, key: K, index: this) => boolean, thisArg?: any): K | undefined;
    /**
     * Identical in behaviour to [Array.sort();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
     * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * @example
     * sort((a, b) => a - b);
     */
    sort(compareFn?: (firstVal: V, secondVal: V, firstKey: K, secondKey: K) => number): this;
    /**
     * Fetch the first value(s) of this Index
     * @param {number} [amount] The amount of values to be returned starting at the beginning
     */
    first(): V | undefined;
    first(amount: number): V[];
    firstKey(): K;
    firstKey(amount: number): K[];
    firstEntry(): [K, V] | undefined;
    firstEntry(amount: number): [K, V][];
    lastEntry(): [K, V] | undefined;
    lastEntry(amount: number): [K, V][];
    lastKey(): K | undefined;
    lastKey(amount: number): K[];
    /**
     * Fetch the last value(s) of this Index
     * @param {number} [amount] The amount of values to be returned starting at the end
     */
    last(): V | undefined;
    last(amount: number): V[];
    /**
     * Fetch random value(s)
     * @param {number} [amount] The amount of random values to return
     */
    random(): V;
    random(amount: number): V[];
    /**
     * Fetch random key(s)
     * @param {number} [amount] The amount of random keys to return
     */
    randomKey(): K;
    randomKey(amount: number): K[];
    /**
     * Fetch a random entry or entries
     * @param {number} [amount] The amount of random entries to return
     */
    randomEntry(): [K, V];
    randomEntry(amount: number): [K, V][];
    forEach(callbackfn: (value: V, key: K, index: this) => void, thisArg?: any): void;
    array(): V[];
    keyArray(): K[];
    entryArray(): [K, V][];
}
export declare class Collection<T> extends Set<T> {
    constructor(iterable?: Iterable<T> | null);
    /**
     * Identical in behaviour to [Array.map();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
     * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the Collection.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    map<U>(callbackfn: (value: any, index: number, collection: this) => U, thisArg?: any): U[];
    /**
     * Identical in behaviour to [Array.sort();](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
     * @param compareFn Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn?: (a: T, b: T) => number): Collection<T>;
    array(): T[];
}
declare type ConcatIndex<K, V> = Index<K, V> | Index<K, V>[];
export {};
