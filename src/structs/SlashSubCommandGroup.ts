import { Collection } from 'js-augmentations';
import SlashSubCommand from './SlashSubCommand.js';


class SlashSubCommandGroup {
    public name: string;
    public description: string;
    public commands: Collection<SlashSubCommand>;   

    constructor() {
        this.commands = new Collection();
    }

    get data() {
        return;
    }
}