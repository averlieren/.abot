const Commands    = require('../commands.js');
require('coffee-script').register();
const Config   = require('../config.coffee');
const Permissions = require('../permissions.js');

module.exports = {
  "action": function(bot, message, args){
    var disabled = Config.raw('commands/disabled');
    var list     = [];
    var retList  = [];
    var commands = Commands.getCommands();

    commands.forEach(function(cmd){
      var command = require('./' + cmd);
      if(Commands.check(command, message.sender.id, message.channel.server.id) && (disabled.indexOf(cmd.replace('.js', '')) == -1)){
        var aliases = (command.alias != undefined) ? (command.alias.length > 0) ? `\n\tAliases: ${command.alias.join(', ')}` : '' : '';
        list.push(Config.get('commands/prefix') + cmd.replace('.js', '') + ": " + command.description + aliases);
      }
    });
    var amount   = list.length;
    var pages    = Math.ceil(amount / 5);
    var current  = (args[1] != undefined) ? Number(args[1]) : 1;
    var count    = 0,
        min      = (current < pages) ? (((current - 1) * 5) > -1) ? ((current - 1) * 5) : 0 : (current == pages) ? ((pages - 1) * 5) : 0,
        max      = min + 5;
    if(current < 1 || current > pages)
      current = 1;
    for(var i = min; i < max; i++)
      retList.push(list[i]);
    Commands.reply(bot, message, `\n**List of Commands:**\n${retList.join('\n\n')}\n**Page ${current} of ${pages}**`, 15000);
  },
  "description": "List all commands.",
  "permission": "commands.help",
  "alias": [
    "commands"
  ]
}
