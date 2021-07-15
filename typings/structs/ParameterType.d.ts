import { Message } from 'discord.js';
import Client from '../client/Client.js';
import { Awaited } from '../util/types.js';
declare type ParameterTypeKey = 'String' | 'Number' | 'Boolean' | 'User' | 'Member' | 'Channel' | 'Role';
declare type ParameterTypeResolvable = ParameterTypeOptions | ParameterType;
declare type ParameterTypePredicate = (this: Client, arg: string, message: Message) => Awaited<boolean>;
interface ParameterTypeOptions {
    key: string;
    description?: string;
    predicate?: ParameterTypePredicate;
}
declare class ParameterType implements Required<ParameterTypeOptions> {
    key: string;
    description: string;
    predicate: ParameterTypePredicate;
    constructor(options?: Partial<ParameterTypeOptions>);
    edit(options: Partial<ParameterTypeOptions>): this;
    setKey(key: string): this;
    setDescription(description: string): this;
    setPredicate(predicate: ParameterTypePredicate): this;
}
export { ParameterType, ParameterTypeKey, ParameterTypePredicate, ParameterTypeResolvable };
export default ParameterType;
