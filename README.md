## Description

discord-bot-framework is a basic command manager designed with [discord.js](https://www.npmjs.com/package/discord.js)
* Object oriented
* Written in TypeScript: included typings
* Simple and easy-to-use
## Installation
This package requires [Node.js](https://nodejs.org/en/download/) 14.0.0 or later.
## Example usage
```javascript
const { Client, Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { Intents } = require('discord.js');

const client = new Client({
    token: 'A valid Discord bot token',
    intents: Intents.FLAGS.DIRECT_MESSAGES
    // Intents are now required by discord for all bots
});

client.login();

client.commands
    .setPrefix('$')
    // The bot will use the prefix to discriminate messages
    .indexDefaults()
    // Indexes any commands included in the module such as 'help' command
    .indexCommands(
        new Command()
            .setName('purge')
            .addAliases('bulkdelete')
            // Both the name and aliases are used by users to call the command
            .setDescription('Delete messages')
            // Both the name and description are displayed in the provided 'help' command
            .addParameters(
                // Parameters define the potential inputs users can provide
                new Parameter()
                    .setKey('amount')
                    // Used to identify the users argument: if no label is set the key is displayed
                    .setLabel('number')
                    // The label displayed to the user when prompted for input
                    .setType('number')
                    // By defining a type, the client will automatically check the user has inputted the correct type
                    .setDescription('The number of messages to be deleted')
                    // The description displayed to users when prompted for an input
            )
            .setGroup('Administration')
            // The group of commands this command belongs to: the group must have been previously indexed
            .setType('Guild')
            // The command type determines where the command can be called; by default it can be called in any channel
            .setCallback(function(message, args) {
                // The callback function is the function executed when this command is called by a user

                const input = args.get('amount');

                if (!input || !input.isNumber())
                    return;

                message.channel.bulkDelete(input.value);
            });
    )