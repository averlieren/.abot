const Commands = require('../commands.js');

module.exports = {
  "action": function(bot, message, args){
    if(args.length > 1)
      Commands.playSound(bot, message, args[1], "youtube");
  },
  "description": "Play audio from any YouTube video.",
  "permission": "commands.youtube",
  "alias": [
    "yt"
  ]
}
