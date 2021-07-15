import { Collection } from 'js-augmentations';
import { isIterable } from '../util/util.js';
import Command from './Command.js';
import { CommandResolvable } from './CommandManager.js';

interface CommandGroupOptions {
    key?: string;
    label?: string;
    description?: string;
    commands?: Iterable<CommandResolvable>;
}

class CommandGroup implements Required<CommandGroupOptions> {
    public key: string;
    public label: string;
    public description: string;
    public readonly commands: Collection<Command>;

    constructor(options?: CommandGroupOptions) {
        this.commands = new Collection();

        if (options)
            this.repair(options);
    }

    repair(options: CommandGroupOptions): this;
    repair({ key, label, description, commands }: CommandGroupOptions): this {
        if (key)
            this.setKey(key);

        if (label)
            this.setLabel(label);

        if (description)
            this.setDescription(description);

        if (commands && isIterable(commands))
            this.addCommands(...commands);

        return this;
    }

    setKey(key: string) {
        if (typeof key !== 'string')
            throw new TypeError(`Type ${typeof key} is not assignable to type 'string'.`);

        this.key = key;

        if (!this.label)
            this.label = this.key;

        return this;
    }

    setLabel(label: string) {
        if (typeof label !== 'string')
            throw new TypeError(`Type ${typeof label} is not assignable to type 'string'.`);

        this.label = label;

        return this;
    }

    setDescription(description: string): this {
        if (typeof description !== 'string')
            throw new TypeError(`Type '${typeof description}' is not assignable to type 'string'.`);

        this.description = description;

        return this;
    }

    addCommands(...commands: CommandResolvable[]) {
        commands.map(item => isIterable(item) ? [ ...item ] : item).flat().forEach(command => this.commands.add(new Command(command)));

        return this;
    }
}

export default CommandGroup;