import { Channel, GuildMember, Role, User } from 'discord.js';
import Parameter from './Parameter.js';
import ParameterType, { ParameterTypeKey } from './ParameterType.js';

class Argument {
    constructor(public value: any, public type: ParameterType | ParameterTypeKey, public parameter: Parameter) {
        this.parameter = parameter;
        this.value = value;
        this.type = type;
    }

    public isMember(): this is MemberArgument {
        return this.type === 'Member';
    }

    public isRole(): this is RoleArgument {
        return this.type === 'Role';
    }

    public isChannel(): this is ChannelArgument {
        return this.type === 'Channel';
    }

    public isUser(): this is UserArgument {
        return this.type === 'User';
    }

    public isBoolean(): this is BooleanArgument {
        return this.type === 'Boolean';
    }

    public isNumber(): this is NumberArgument {
        return this.type === 'Number';
    }

    public isString(): this is StringArgument {
        return this.type === 'String';
    }
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

export {
    Argument,
    MemberArgument,
    RoleArgument,
    ChannelArgument,
    UserArgument,
    BooleanArgument,
    NumberArgument,
    StringArgument,
}

export default Argument;