/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
function toList(items: string[], trailingConnective = 'and') {
    return `${items.length > 1 ? `${items.slice(0, items.length - 1).join(', ')} ${trailingConnective} ${items[items.length - 1]}` : items }`;
}

/**
 * Convert any value to a string
 * @param value
 */
function toString(value: any) {
    return `${value}`;
}

/**
 * No-operation
 */
function noop() {
    // noop
}

function isIterable(obj: any): obj is Iterable<any> {
    return typeof obj[Symbol.iterator] === 'function';
}

function toArray<U>(obj: Iterable<U>): U[] {
    return [ ...obj ];
}

interface AnyObject {
    [key: string]: any;
}

function Omit<O extends AnyObject, K extends keyof O>(obj: O, ...keys: K[]): Omit<O, K> {
    keys.forEach(key => delete obj[key]);

    return obj;
}

export {
    toList,
    toString,
    noop,
    isIterable,
    toArray,
    Omit
}