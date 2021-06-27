"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parameter = void 0;
const js_augmentations_1 = require("js-augmentations");
const util_js_1 = require("../util/util.js");
class Parameter {
    constructor(options) {
        this.choices = new js_augmentations_1.Collection();
        this.setWordCount(1);
        this.setCaseSensitive(false);
        this.setRequired(true);
        this.setType('string');
        this.setTimeout(15000);
        if (options)
            this.edit(options);
    }
    edit(options) {
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
        if (choices && util_js_1.isIterable(choices))
            this.addChoices(...choices);
        return this;
    }
    setTimeout(timeout) {
        if (typeof timeout !== 'number')
            throw new TypeError(`Type ${typeof timeout} is not assignable to type 'number'.`);
        if (timeout < 3000)
            throw new Error('The timeout of a parameter cannot be less than 3000 milliseconds.');
        if (timeout > 60000)
            throw new Error('The timeout of a parameter cannot be greater than 60000 milliseconds.');
        this.timeout = timeout;
        return this;
    }
    setDefault(value) {
        this.default = value;
        return this;
    }
    /**
     * @param choices
     */
    addChoices(...choices) {
        choices.flatMap(choice => typeof choice !== 'string' && util_js_1.isIterable(choice) ? [...choice] : choice).forEach(choice => {
            if (typeof choice !== 'string')
                throw new TypeError(`Type ${typeof choice} is not assignable to type 'string'.`);
            this.choices.add(choice);
        });
        return this;
    }
    /**
     * @param required Whether or not the user is required to provide an input for this parameter
     */
    setRequired(required) {
        if (typeof required !== 'boolean')
            throw new TypeError(`Type '${typeof required}' is not assignable to type 'boolean'.`);
        this.required = required;
        return this;
    }
    /**
     * @param caseSensitive Whether or not the user input should be case sensitive if choices are set
     */
    setCaseSensitive(caseSensitive) {
        if (typeof caseSensitive !== 'boolean')
            throw new TypeError(`Type '${typeof caseSensitive}' is not assignable to type 'boolean'.`);
        this.caseSensitive = caseSensitive;
        return this;
    }
    /**
     * @param label The label to display to the user
     */
    setLabel(label) {
        if (typeof label !== 'string')
            throw new TypeError(`Type '${typeof label}' is not assignable to type 'string'.`);
        this.label = label;
        return this;
    }
    /**
     * @param key The identifier for the user input
     */
    setKey(key) {
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
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);
        this.description = description;
        return this;
    }
    setType(key) {
        this.type = key;
        return this;
    }
    /**
     * @param count The number of words required
     */
    setWordCount(count) {
        if (typeof count !== 'number' && count !== 'unlimited')
            throw new TypeError(`Type ${typeof count} is not assignable to type 'number' or 'unlimited'.`);
        if (count < 1)
            throw new Error('The word count of a parameter must be greater than 0.');
        this.wordCount = count;
        return this;
    }
}
exports.Parameter = Parameter;
exports.default = Parameter;
