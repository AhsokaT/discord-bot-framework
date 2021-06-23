export type Resolvable<T> = T | Iterable<T>;

export type Snowflake = `${bigint}` | bigint;