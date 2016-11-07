const Commands = require('../commands.js');

module.exports = {
  "action": function(bot, message, args){
    bot.joinServer(args[1]);
  },
  "description": "pong",
  "permission": "commands.joinserver",
  "alias": []
}
