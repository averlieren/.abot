const Commands = require('../commands.js');

module.exports = {
  "action": function(bot, message, args){
    if(bot.voiceConnection != null)
      bot.voiceConnection.stopPlaying();
    bot.deleteMessage(message, {wait: 2500});
  },
  "description": "Tell the bot to shut up.",
  "permission": "commands.stop",
  "alias": [
    "end"
  ]
}
