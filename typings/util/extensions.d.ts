export declare class Index<K, V> extends Map<K, V> {
    constructor(...entries: readonly [K, V][]);
    first(): V | undefined;
    array(): V[];
    keyArray(): K[];
}
export declare class Group<T> extends Set<T> {
    constructor(iterable?: Iterable<T>);
    first(): T | undefined;
    array(): T[];
}
