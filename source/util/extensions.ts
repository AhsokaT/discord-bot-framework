export class Index<K, V> extends Map<K, V> {
    constructor(...entries: readonly [K, V][]) {
        super(entries);
    }

    public first(): V | undefined {
        return this.values().next()?.value;
    }

    public array(): V[] {
        return [ ...this.values() ];
    }
}

export class Group<T> extends Set<T> {
    constructor(iterable?: Iterable<T>) {
        super(iterable);
    }

    public first(): T | undefined {
        return this.values().next()?.value;
    }

    public array(): T[] {
        return [ ...this.values() ];
    }
}