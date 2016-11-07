const Commands    = require('../commands.js');
const Roles       = require('../roles.js');
const Permissions = require('../permissions.js');

function toggle(user, role, other){
  other      = other || false;
  var type   = (other) ? ` <@${user}> ` : ` `;
  var toggle = Roles.toggleRole(user, role);
  return (toggle != null) ? (toggle) ? `Added ${type} to ${role}` : `Removed ${type} from ${role}` : `Invalid role given.`;
}

module.exports = {
  "action": function(bot, message, args){
    if(args.length > 1){
      if(args[1].toLowerCase() == "list"){
        var current = (Roles.userRoles(message.sender.id).length > 0) ? "Your current roles: " + Roles.userRoles(message.sender.id).join(', ') : "You do not have any roles currently.";
        Commands.reply(bot, message, "\nList of Game Roles:\n" + Roles.list() + "\n\n" + current, 15000);
      } else if(args[1].toLowerCase() == "set"){
        var user = args[2].replace('<@', '').replace('>', '').replace('!', '');
        args.splice(0, 3);
        Commands.reply(bot, message, toggle(user, Roles.resolve(args.join(' ')), true), 5000);
      } else {
        args.shift();
        Commands.reply(bot, message, toggle(message.sender.id, Roles.resolve(args.join(' '))), 5000);
      }
    }
  },
  "description": "Join/leave a game role.",
  "permission": "commands.gamerole",
  "alias": [
    "g"
  ]
}
