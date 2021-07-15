import { Collection } from 'js-augmentations';
import Command from './Command.js';
import { CommandResolvable } from './CommandManager.js';
interface CommandGroupOptions {
    key?: string;
    label?: string;
    description?: string;
    commands?: Iterable<CommandResolvable>;
}
declare class CommandGroup implements Required<CommandGroupOptions> {
    key: string;
    label: string;
    description: string;
    readonly commands: Collection<Command>;
    constructor(options?: CommandGroupOptions);
    repair(options: CommandGroupOptions): this;
    setKey(key: string): this;
    setLabel(label: string): this;
    setDescription(description: string): this;
    addCommands(...commands: CommandResolvable[]): this;
}
export default CommandGroup;
