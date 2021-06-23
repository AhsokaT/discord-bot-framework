"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterType = void 0;
class ParameterType {
    constructor(options) {
        if (options)
            this.edit(options);
    }
    edit(options) {
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
    setKey(key) {
        if (typeof key !== 'string')
            throw new TypeError(`Type ${typeof key} is not assignable to type 'string'.`);
        this.key = key;
        return this;
    }
    setDescription(description) {
        if (typeof description !== 'string')
            throw new TypeError(`Type ${typeof description} is not assignable to type 'string'.`);
        this.description = description;
        return this;
    }
    setPredicate(predicate) {
        if (typeof predicate !== 'function')
            throw new TypeError(`Type ${typeof predicate} is not assignable to type 'ParameterTypePredicate'`);
        this.predicate = predicate;
        return this;
    }
}
exports.ParameterType = ParameterType;
exports.default = ParameterType;
