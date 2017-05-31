const Discord = require('discord.js');
module.exports = {
  action: (client, args, message)=>{
    message.reply('You do not have permissions to execute this command.');
  },
  'alias': [''],
  'description': 'doesn\'t do shhit, just forces a second page'
}
