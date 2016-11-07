const Commands = require('../commands.js');
require('coffee-script').register();
const Config   = require('../config.coffee');

module.exports = {
  "action": function(bot, message, args){
    Commands.playSound(bot, message, Config.get('directories/soundboard/default') + '/taps.mp3');
  },
  "description": "They talk about my one taps.",
  "permission": "commands.taps",
  "alias": []
}
