var Roles = require('./roles.js');

function Tag(){

}

Tag.prototype.tag = function(bot, message){
  var content = message.content.toLowerCase();
  var server  = message.channel.server;
  var split   = content.split(' ');
  var role    = undefined;

  split.forEach(function(p){
    if(p.indexOf('@') > -1){
      role = new Roles(bot, message).resolve(p.replace('@', ''));
      if(role != undefined){
        var tagged = [];
        server.members.forEach(function(m){
          server.rolesOfUser(m).forEach(function(r){
            if(r === role && !(tagged.indexOf(m.id) > -1) && m.id != message.sender.id)
              tagged.push("<@" + m.id + ">");
          });
        });
        if(message.sender.id != bot.user.id && tagged.length > 0 && role != undefined){
          bot.sendMessage(message.channel, "You have been tagged by <@" + message.sender.id + ">" + " for " + role.name + "\n\n" + tagged.join('\t'));
        } else if(tagged.length < 1 && role != undefined){
          bot.sendMessage(message.channel, "<@" + message.sender.id + "> No one has joined \"" + role.name + "\"");
        }
      }
    }
  });
}

module.exports = Tag;
