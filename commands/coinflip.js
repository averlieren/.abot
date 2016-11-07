const Commands = require('../commands.js');

module.exports = {
  "action": function(bot, message, args){
    Commands.reply(bot, message, Math.floor(Math.random() * 2) == 0 ? 'Heads' : 'Tails', 5000);
  },
  "description": "tosses a coin",
  "permission": "commands.coin",
  "alias": [
    "coin"
  ]
}
