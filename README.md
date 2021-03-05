## Description

discord-bot-framework is a basic command manager designed with [discord.js](https://www.npmjs.com/package/discord.js).
* Object oriented
* Type declarations
* Simple and easy-to-use
## Installation
This package requires [Node.js](https://nodejs.org/en/download/) 14.0.0 or later.
## Example usage
```javascript
const { DiscordBot } = require('@pat.npm.js/discord-bot-framework');

const bot = new DiscordBot({
  prefix: '$',
  token: 'A valid Discord bot token',
  groups: [ 'Miscellaneous', 'Information' ],
  clientOptions: {
	  presence: { status: 'idle' }
  }
});

bot.addCommand({
  name: 'hi',
  description: 'Say hi!',
  parameters: [
	{
		name: 'name',
		description: 'Your name',
		wordCount: 'unlimited',
		required: true
	}
  ],
  group: 'Miscellaneous',
  callback: function (message, client, args) {
	message.reply(`Hey, ${args['name']}!`);
  }
});

bot.addCommand({
  name: 'purge',
  description: 'Delete messages from a channel',
  permissions: [
    'MANAGE_MESSAGES'
  ],
  parameters: [
	{
	  name: 'amount',
	  description: 'The number of messages you want to delete',
	  wordCount: 1,
	  type: 'number',
	  required: true
	}
  ],
  callback: function(message, client, args) {
	message.channel.bulkDelete(args['amount']).catch(error => message.reply('I could not delete any messages!'));
  }
});
```"# discord-bot-framework" 
