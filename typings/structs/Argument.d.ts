import { Channel, GuildMember, Role, User } from 'discord.js';
import Parameter from './Parameter.js';
import ParameterType, { ParameterTypeKey } from './ParameterType.js';
declare class Argument {
    value: any;
    type: ParameterType | ParameterTypeKey;
    parameter: Parameter;
    constructor(value: any, type: ParameterType | ParameterTypeKey, parameter: Parameter);
    isMember(): this is MemberArgument;
    isRole(): this is RoleArgument;
    isChannel(): this is ChannelArgument;
    isUser(): this is UserArgument;
    isBoolean(): this is BooleanArgument;
    isNumber(): this is NumberArgument;
    isString(): this is StringArgument;
}
interface MemberArgument extends Argument {
    type: 'member';
    value: GuildMember;
}
interface RoleArgument extends Argument {
    type: 'role';
    value: Role;
}
interface ChannelArgument extends Argument {
    type: 'channel';
    value: Channel;
}
interface UserArgument extends Argument {
    type: 'user';
    value: User;
}
interface BooleanArgument extends Argument {
    type: 'boolean';
    value: boolean;
}
interface NumberArgument extends Argument {
    type: 'number';
    value: number;
}
interface StringArgument extends Argument {
    type: 'string';
    value: string;
}
export { Argument, MemberArgument, RoleArgument, ChannelArgument, UserArgument, BooleanArgument, NumberArgument, StringArgument, };
export default Argument;
