import { Message } from 'discord.js';
import Client from '../client/Client.js';

type ParameterTypeKey =
    | 'string'
    | 'number'
    | 'boolean'
    | 'user'
    | 'member'
    | 'channel'
    | 'role';

type ParameterTypeResolvable =
    | ParameterTypeOptions
    | ParameterType;

type ParameterTypePredicate = (this: Client, arg: string, message: Message) => Awaited<boolean>;

interface ParameterTypeOptions {
    key: string;
    description?: string;
    predicate?: ParameterTypePredicate;
}

class ParameterType implements Required<ParameterTypeOptions> {
    public key: string;
    public description: string;
    public predicate: ParameterTypePredicate;

    constructor(options?: Partial<ParameterTypeOptions>) {
        if (options)
            this.edit(options);
    }

    public edit(options: Partial<ParameterTypeOptions>): this {
        if (typeof options !== 'object')
            throw new TypeError(`Type ${typeof options} is not assignable to type 'Partial<ParameterTypeOptions>'.`);

        const { key, description, predicate } = options;

        if (key)
            this.setKey(key);

        if (description)
            this.setDescription(description);

        if (predicate)
            this.setPredicate(predicate);

        return this;
    }

    public setKey(key: string): this {
        if (typeof key !== 'string')
            throw new TypeError(`Type ${typeof key} is not assignable to type 'string'.`);

        this.key = key;

        return this;
    }

    public setDescription(description: string): this {
        if (typeof description !== 'string')
            throw new TypeError(`Type ${typeof description} is not assignable to type 'string'.`);

        this.description = description;

        return this;
    }

    public setPredicate(predicate: ParameterTypePredicate): this {
        if (typeof predicate !== 'function')
            throw new TypeError(`Type ${typeof predicate} is not assignable to type 'ParameterTypePredicate'`);

        this.predicate = predicate;

        return this;
    }
}

export {
    ParameterType,
    ParameterTypeKey,
    ParameterTypePredicate,
    ParameterTypeResolvable
}

export default ParameterType;