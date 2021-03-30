## Description

discord-bot-framework is a basic command manager designed with [discord.js](https://www.npmjs.com/package/discord.js)
* Object oriented
* Includes type declarations
* Simple and easy-to-use
## Installation
This package requires [Node.js](https://nodejs.org/en/download/) 14.0.0 or later.
## Methods
```typescript
Command#edit(options: CommandInfo): Command;
Command#setName(name: string): Command;
Command#setDescription(description: string): Command;
Command#setCategory(category: string): Command;
Command#setNSFW(nsfw: boolean): Command;
Command#setCallback(callback: (message: Message, client: Client, args: object) => void): Command;
Command#addParameter(parameter: ParameterType | ParameterType[]): Command;
Command#addPermission(permission: PermissionString | PermissionString[]): Command;
Command#addAlias(alias: string): Command;
Client#commands#add(command: Command | CommandInfo): Command;
Client#commands#get(command: string | Command): Command;
Client#commands#remove(command: string | Command): Command;
Client#commands#all(): Command[];
```
## Example usage
```javascript
const { Client, Command } = require('@pat.npm.js/discord-bot-framework');

const client = new Client({
    prefix: '$', // The bot will use this to discriminate messages
    token: 'A valid Discord bot token',
    categories: [ 'Miscellaneous', 'Information' ], // Categories that individual commands can belong to
    presence: { status: 'idle' }
});

// .commands.add(); also accepts an instance of the Command class, incase you declare your commands elsewhere
client.commands.add({
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
        message.reply(`Hey, ${args.first()}!`);
    }
});

client.commands.add({
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
        const amount = args.first();
        // or
        const amount = args.get('amount');

        message.channel.bulkDelete(amount).catch(error => message.reply('I could not delete any messages!'));
    }
});
```
