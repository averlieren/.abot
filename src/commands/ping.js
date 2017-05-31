/*
  Debug command, test if bot is online and responsive.
*/
module.exports = {
  action: (client, args, message)=>{
    message.reply('pong');
  },
  'alias': [''],
  'description': 'Check if the bot is online'
}
