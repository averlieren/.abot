const Commands = require('../commands.js');
require('coffee-script').register();
const Config   = require('../config.coffee');

module.exports = {
  "action": function(bot, message, args){
    Commands.playSound(bot, message, Config.get('directories/soundboard/airhorn'));
  },
  "description": "Play an airhorn noise.",
  "permission": "commands.airhorn",
  "alias": [
    "ah"
  ]
}
