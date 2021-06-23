import { Collection } from 'js-augmentations';
import { Resolvable } from '../util/types.js';
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
    default?: any;
}
declare type ParameterResolvable = Resolvable<Parameter> | Resolvable<ParameterOptions>;
declare class Parameter implements Required<ParameterOptions> {
    key: string;
    label: string;
    type: string;
    description: string;
    wordCount: number | 'unlimited';
    characterLimit: number;
    caseSensitive: boolean;
    required: boolean;
    choices: Collection<string>;
    default: any;
    constructor(options?: Partial<ParameterOptions>);
    edit(options: Partial<ParameterOptions>): this;
    /**
     * @param choices
     */
    addChoices(...choices: Resolvable<string>[]): this;
    /**
     * @param required Whether or not the user is required to provide an input for this parameter
     */
    setRequired(required: boolean): this;
    /**
     * @param caseSensitive Whether or not the user input should be case sensitive if choices are set
     */
    setCaseSensitive(caseSensitive: boolean): this;
    /**
     * @param label The label to display to the user
     */
    setLabel(label: string): this;
    /**
     * @param key The identifier for the user input
     */
    setKey(key: string): this;
    /**
     * @param description A short description of your expected user input
     */
    setDescription(description: string): this;
    /**
     * @param key The key of a ParameterType
     */
    setType(key: ParameterTypeKey): this;
    setType(key: string): this;
    /**
     * @param count The number of words required
     */
    setWordCount(count: number | 'unlimited'): this;
}
export { Parameter, ParameterOptions, ParameterResolvable };
export default Parameter;
