const Data   = require('./data.js');
const Roles  = require('./roles.js');
const Logger = require('./logger.js');

module.exports = {
  tag: function (bot, message){
    var content = message.content.toLowerCase();
    var server  = message.channel.server;
    var words   = content.split(' ');
    var role    = undefined;

    words.forEach(function(word){
      if(word.indexOf('@') > -1){
        role = Roles.resolve(word.replace('@', ''));
        if(role != undefined){
          var tagged = [];
          server.members.forEach(function(member){
            if(Roles.hasRole(member.id, role) && !(tagged.indexOf(member.id) > -1) && member.id != message.sender.id && Data.get(member.id, 'tagging') != false)
              tagged.push(member.mention());
          });
          if(message.sender.id != bot.user.id && tagged.length > 0 && role != undefined){
            bot.sendMessage(message.channel, `You have been tagged by ${message.sender.mention()} for ${role}\n\n${tagged.join('\t')}\n\n**If you wish to opt-in or opt-out do *!stfu***`);
          } else if(tagged.length < 1 && role != undefined) {
            bot.sendMessage(message.channel, message.sender.mention() + ` No one has joined "${role}"`);
          }
          Logger.log('info', `tag: ${message.sender.name} (ID: ${message.sender.id}) ${message.content}`);
        }
      }
    });
  }
}
