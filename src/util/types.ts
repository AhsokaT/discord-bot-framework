export type Resolvable<T> = T | Iterable<T>;

export type Snowflake = `${bigint}`;

export type Awaited<T> = T | Promise<T>;