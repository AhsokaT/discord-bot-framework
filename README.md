## Description

discord-bot-framework is a basic command manager designed with [discord.js](https://www.npmjs.com/package/discord.js)
* Object oriented
* Includes type declarations
* Simple and easy-to-use
## Installation
This package requires [Node.js](https://nodejs.org/en/download/) 14.0.0 or later.
## Example usage
```javascript
const { Client, Command, SlashCommand } = require('@pat.npm.js/discord-bot-framework');

const client = new Client({
    prefix: '$', // The bot will use this to discriminate messages
    token: 'A valid Discord bot token',
    presence: { status: 'online' }
});

client.commands.add(
    new Command()
        // The name of your command
        .setName('purge') 
        // A short description of your command
        .setDescription('Delete messages')
        // Alternative name(s) this command can be called by
        .addAlias('bulkdelete')
        // The category of commands this command belongs to
        .setCategory('admin')
        // Permission(s) this command requires to run
        .addPermissions('MANAGE_MESSAGES')
        // A parameter this command accepts; alternatively use addParameters(); to add multiple
        .addParameter('number', 'The number of messages to delete', 'number')
        // The function to be executed when this command is invoked
        .setCallback(async (message, client, args) => {
            // args.first() returns the first user input; alternatively use args.get('param_name');
            const amount = args.first();

            message.channel.bulkDelete(amount)
                .catch(err => message.channel.send('Oh no, I encountered an error!').catch(console.error));
        })
);

// Alternatively use client.slash.global().post(); to post commands globally
// Please note: global slash commands can take up to an hour to cache
client.slash.guild('server_id').post(
    new SlashCommand()
        // The name of your slash command
        .setName('purge')
        // The description of your slash command
        .setDescription('Delete messages')
        // Add a user input option
        .addOption('number', 'The number of messages to delete', 'INTEGER')
        // The function to be executed when this command is invoked
        .setCallback((interaction, client) => {
            // alternatively use interaction.options.get('option_name');
            const amount = interaction.options.first();

            interaction.channel.bulkDelete(amount)
                // Please note: the interaction.reply(); method can only be used once
                // use interaction.channel.send(); to send followup messages
                .then(deleted => interaction.reply(`Deleted ${deleted.size} messages!`))
                .catch(err => interaction.reply('Oh no, I encountered an error!').catch(console.error));
        })
);
```
## Methods
```typescript
Command#edit(options: CommandInfo): Command;
Command#setName(name: string): Command;
Command#setDescription(description: string): Command;
Command#setCategory(category: string): Command;
Command#setNSFW(nsfw: boolean): Command;
Command#setCallback(callback: (message: Message, client: Client, args: Arguments) => void): Command;
Command#addParameter(name: string, description?: string, type?: 'string' | 'number', wordCount?: number | 'unlimited', required?: boolean, choices?: string[]): Command;
Command#addParameters(parameters: ...Parameter[]): Command;
Command#addPermissions(permissions: ...PermissionString[]): Command;
Command#addAlias(alias: ...string[]): Command;

SlashCommand#setName(name: string): SlashCommand;
SlashCommand#setDescription(description: string): SlashCommand;
SlashCommand#addOption(name: string, description: string, type: ApplicationCommandOptionTypeResolvable, required: boolean = true, choices?: ApplicationCommandOptionChoice[], options?: ApplicationCommandOption[]): SlashCommand;
SlashCommand#addOptions(...options: ApplicationCommandOption[]): SlashCommand;
SlashCommand#setCallback((interaction: InteractionResponse, client: Client) => void): SlashCommand;

Client#commands#add(command: Command | CommandInfo): Command;
Client#commands#get(command: string | Command): Command;
Client#commands#remove(command: string | Command): Command;
Client#commands#all(): Command[];

Client#slash#guild(id: string): SlashBase;
Client#slash#global(): SlashBase;

SlashBase#post(command: SlashCommand): SlashCommand;
SlashBase#delete(name: string): SlashCommand;
SlashBase#all(): SlashCommand[];
```