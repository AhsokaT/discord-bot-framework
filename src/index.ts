export { DiscordBot } from './Bot.js';
export { Command } from './Command.js';

import { Command } from './Command.js';

let x = new Command({
    name: 'testcmd',
    callback () {}
});

console.log(x.name);

x.edit({
    name: 'bar',
    description: 'foo'
});

console.log(x.name)