const Commands = require('../commands.js');
require('coffee-script').register();
const Config   = require('../config.coffee');

module.exports = {
  "action": function(bot, message, args){
    if(args.length > 1){
      Commands.playSound(bot, message, Config.get('directories/soundboard/default') + '/' + args[1]);
    } else {
      Commands.playSound(bot, message, Config.get('directories/soundboard/default'));
    }
  },
  "description": "Play a sound from the soundboard.",
  "permission": "commands.soundboard",
  "alias": [
    "sb"
  ]
}
