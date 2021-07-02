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
    type: 'Member';
    value: GuildMember;
}
interface RoleArgument extends Argument {
    type: 'Role';
    value: Role;
}
interface ChannelArgument extends Argument {
    type: 'Channel';
    value: Channel;
}
interface UserArgument extends Argument {
    type: 'User';
    value: User;
}
interface BooleanArgument extends Argument {
    type: 'Boolean';
    value: boolean;
}
interface NumberArgument extends Argument {
    type: 'Number';
    value: number;
}
interface StringArgument extends Argument {
    type: 'String';
    value: string;
}
export { Argument, MemberArgument, RoleArgument, ChannelArgument, UserArgument, BooleanArgument, NumberArgument, StringArgument, };
export default Argument;
