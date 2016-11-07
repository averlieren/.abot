//Import modules
const Discord = require('discord.js');
require('coffee-script').register();
//Import classes
const Permissions = require('./permissions.js');
const Commands    = require('./commands.js');
const Config      = require('./config.coffee');
const Logger      = require('./logger.js');
const Roles       = require('./roles.js');
const Data        = require('./data.js');
const Tag         = require('./tag.js');

//Instantiate
var options     = {
  autoReconnect: Config.raw('bot/options/autoReconnect'),
  forceFetchUsers: Config.raw('bot/options/forceFetchUsers'),
  maxCachedMessages: Config.raw('bot/options/maxCachedMessages')
}
const bot = new Discord.Client(options);

bot.on('ready', function(){
  bot.guilds.forEach(function(server){
    server.members.forEach(function(user){
      Data.defaults(user.id, user);
    });
  });
  Logger.log('info', '.abot5.1 has launched successfully.');
});

bot.on('serverNewMember', function(server, user){
  Data.defaults(user.id, user);
});

bot.on('presence', function(old, updated){
  if(updated.game != null){
    var role = Roles.resolve(updated.game.name);
    if(role != null)
      Roles.addToRole(updated.id, role);
  }
});

bot.on('message', function(message){
  try{
    Commands.command(bot, message);
    Tag.tag(bot, message);
  } catch(e){
    Logger.log('error', e);
  }
});

if(Config.raw('bot/account/oauth')){
  bot.loginWithToken(Config.get('bot/account/oauth-token'));
} else {
  bot.login(Config.get('bot/account/username'), Config.get('bot/account/password'));
}
