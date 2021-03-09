## Description

discord-bot-framework is a basic command manager designed with [discord.js](https://www.npmjs.com/package/discord.js)
* Object oriented
* Includes type declarations
* Simple and easy-to-use
## Installation
This package requires [Node.js](https://nodejs.org/en/download/) 14.0.0 or later.
## Methods
```typescript
Command#edit(options: EditOptions): Command;
DiscordBot#commands#add(command: Command | CommandOptions): Command;
DiscordBot#commands#get(command: string | Command): Command;
DiscordBot#commands#remove(command: string | Command): Command;
DiscordBot#commands#all(): Command[];
DiscordBot#login(): Client | undefined;
DiscordBot#logout(): void;
```
## Example usage
```javascript
const { DiscordBot, Command } = require('@pat.npm.js/discord-bot-framework');

const bot = new DiscordBot({
    prefix: '$', // The bot will use this to discriminate messages
    token: 'A valid Discord bot token',
    categories: [ 'Miscellaneous', 'Information' ], // Categories that individual commands can belong to
    clientOptions: { // Discord.JS Client options
        presence: { status: 'idle' }
    }
});

// .commands.add(); also accepts an instance of the Command class, incase you declare your commands elsewhere
bot.commands.add({
    name: 'hi',
    description: 'Say hi!', // Short description of your command; will be displayed on the inbuilt help command
    parameters: [
        {
            name: 'name',
            description: 'Your name',
            wordCount: 'unlimited',
            required: true
        }
    ],
    category: 'Miscellaneous', // Specify the category this command belongs to
    callback: function (message, client, args) {
        message.reply(`Hey, ${args['name']}!`);
    }
});

bot.commands.add({
    name: 'purge',
    description: 'Delete messages from a channel',
    permissions: [
        'MANAGE_MESSAGES' // Module will automatically check your bot and the user have the required permissions
    ],
    parameters: [
        {
            name: 'amount', // Name of the parameter
            description: 'The number of messages you want to delete', // A short description of the parameter
            wordCount: 1, // The number of words expected from the user; 1 by default
            required: true // If true, the module will check that this parameter was passed in before executing the callback
        }
    ],
    callback: function(message, client, args) {
        // args is an object containing user inputs for your parameters
        // You can read user inputs with args['param_name'] or args.param_name
        message.channel.bulkDelete(args['amount']).catch(error => message.reply('I could not delete any messages!'));
    }
});
```
