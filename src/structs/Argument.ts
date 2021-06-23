import { Channel, GuildMember, Role, User } from 'discord.js';
import ParameterType, { ParameterTypeKey } from './ParameterType.js';

class Argument {
    constructor(public value: any, public type: ParameterType | ParameterTypeKey) {
        this.value = value;
        this.type = type;
    }

    public isMember(): this is MemberArgument {
        return this.type === 'member';
    }

    public isRole(): this is RoleArgument {
        return this.type === 'role';
    }

    public isChannel(): this is ChannelArgument {
        return this.type === 'channel';
    }

    public isUser(): this is UserArgument {
        return this.type === 'user';
    }

    public isBoolean(): this is BooleanArgument {
        return this.type === 'boolean';
    }

    public isNumber(): this is NumberArgument {
        return this.type === 'number';
    }

    public isString(): this is StringArgument {
        return this.type === 'string';
    }
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