/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
export declare function toList(items: string[], trailingConnective?: string): string;
/**
 * Convert any value to a string
 * @param value
 */
export declare function toString(value: any): string;
/**
 * No-operation
 */
export declare function noop(): void;
export declare function isIterable(obj: any): obj is Iterable<any>;
export declare function toArray<U>(obj: Iterable<U>): U[];
