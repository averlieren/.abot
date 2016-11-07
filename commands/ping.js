const Commands = require('../commands.js');

module.exports = {
  "action": function(bot, message, args){
    Commands.reply(bot, message, 'pong!', 5000);
  },
  "description": "pong",
  "permission": "commands.ping",
  "alias": []
}
