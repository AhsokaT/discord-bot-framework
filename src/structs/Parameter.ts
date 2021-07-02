import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types.js';
import { isIterable } from '../util/util.js';
import { ParameterTypeKey } from './ParameterType.js';

interface ParameterOptions {
    key: string;
    label?: string;
    type?: string;
    description?: string;
    wordCount?: number | 'unlimited';
    characterLimit?: number;
    caseSensitive?: boolean;
    required?: boolean;
    choices?: Iterable<string>;
    timeout?: number;
    default?: any;
}

type ParameterResolvable =
    | Resolvable<Parameter>
    | Resolvable<ParameterOptions>;

class Parameter implements Required<ParameterOptions> {    
    public key: string;
    public label: string;
    public type: string;
    public description: string;
    public wordCount: number | 'unlimited';
    public characterLimit: number;
    public caseSensitive: boolean;
    public required: boolean;
    public choices: Collection<string>;
    public timeout: number;
    public default: any;

    constructor(options?: Partial<ParameterOptions>) {
        this.choices = new Collection();

        this.setWordCount(1);
        this.setCaseSensitive(false);
        this.setRequired(true);
        this.setType('String');
        this.setTimeout(15000);

        if (options)
            this.edit(options);
    }

    public edit(options: Partial<ParameterOptions>): this {
        if (typeof options !== 'object')
            throw new TypeError(`Type ${typeof options} is not assignable to type 'Partial<ParameterOptions>'.`);

        const { label, type, description, wordCount, caseSensitive, required, choices, key, default: defaultValue } = options;

        if (defaultValue)
            this.setDefault(defaultValue);

        if (key)
            this.setKey(key);

        if (label)
            this.setLabel(label);

        if (type)
            this.setType(type);

        if (description)
            this.setDescription(description);

        if (wordCount)
            this.setWordCount(wordCount);

        if (typeof caseSensitive === 'boolean')
            this.setCaseSensitive(caseSensitive);

        if (typeof required === 'boolean')
            this.setRequired(required);

        if (choices && isIterable(choices))
            this.addChoices(...choices);

        return this;
    }

    public setTimeout(timeout: number): this {
        if (typeof timeout !== 'number')
            throw new TypeError(`Type ${typeof timeout} is not assignable to type 'number'.`);

        if (timeout < 3000)
            throw new Error('The timeout of a parameter cannot be less than 3000 milliseconds.');

        if (timeout > 60000)
            throw new Error('The timeout of a parameter cannot be greater than 60000 milliseconds.');

        this.timeout = timeout;

        return this;
    }

    public setDefault(value: any): this {
        this.default = value;

        return this;
    }

    /**
     * @param choices 
     */
    public addChoices(...choices: Resolvable<string>[]): this {
        choices.flatMap(choice => typeof choice !== 'string' && isIterable(choice) ? [...choice] : choice).forEach(choice => {
            if (typeof choice !== 'string')
                throw new TypeError(`Type ${typeof choice} is not assignable to type 'string'.`);

            this.choices.add(choice);
        });

        return this;
    }

    /** 
     * @param required Whether or not the user is required to provide an input for this parameter
     */
    public setRequired(required: boolean): this {
        if (typeof required !== 'boolean')
            throw new TypeError(`Type '${typeof required}' is not assignable to type 'boolean'.`);

        this.required = required;

        return this;
    }

    /**
     * @param caseSensitive Whether or not the user input should be case sensitive if choices are set
     */
    public setCaseSensitive(caseSensitive: boolean): this {
        if (typeof caseSensitive !== 'boolean')
            throw new TypeError(`Type '${typeof caseSensitive}' is not assignable to type 'boolean'.`);

        this.caseSensitive = caseSensitive;

        return this;
    }

    /**
     * @param label The label to display to the user 
     */
    public setLabel(label: string): this {
        if (typeof label !== 'string')
            throw new TypeError(`Type '${typeof label}' is not assignable to type 'string'.`);

        this.label = label;

        return this;
    }

    /**
     * @param key The identifier for the user input
     */
    public setKey(key: string): this {
        if (typeof key !== 'string')
            throw new TypeError(`Type '${typeof key}' is not assignable to type 'string'.`);

        this.key = key;

        if (!this.label)
            this.label = key;

        return this;
    }

    /**
     * @param description A short description of your expected user input
     */
    public setDescription(description: string): this {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);

        this.description = description;

        return this;
    }

    /**
     * @param key The key of a ParameterType
     */
    public setType(key: ParameterTypeKey): this;
    public setType(key: string): this;
    public setType(key: string): this {
        this.type = key;

        return this;
    }

    /**
     * @param count The number of words required
     */
    public setWordCount(count: number | 'unlimited'): this {
        if (typeof count !== 'number' && count !== 'unlimited')
            throw new TypeError(`Type ${typeof count} is not assignable to type 'number' or 'unlimited'.`);

        if (count < 1)
            throw new Error('The word count of a parameter must be greater than 0.');

        this.wordCount = count;

        return this;
    }
}

export {
    Parameter,
    ParameterOptions,
    ParameterResolvable
}

export default Parameter;