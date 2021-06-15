/**
 * Convert an array of strings to a list
 * @param items An array of strings
 * @param trailingConnective The connective to precede the final item of the array; default 'and'
 */
declare function toList(items: string[], trailingConnective?: string): string;
/**
 * Convert any value to a string
 * @param value
 */
declare function toString(value: any): string;
/**
 * No-operation
 */
declare function noop(): void;
declare function isIterable(obj: any): obj is Iterable<any>;
declare function toArray<U>(obj: Iterable<U>): U[];
interface AnyObject {
    [key: string]: any;
}
declare function Omit<O extends AnyObject, K extends keyof O>(obj: O, ...keys: K[]): Omit<O, K>;
export { toList, toString, noop, isIterable, toArray, Omit };
