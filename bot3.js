//import node modules
var Discord     = require('discord.js');

//import bot classes
var Commands    = require('./commands.js');
var Config      = require('./config.js');
var Logger      = require('./logger.js');
var Tag         = require('./tag.js');
var Roles       = require('./roles.js');

//instantiate variables
var cmdProcess  = new Commands();
var conf        = new Config();
var bot         = new Discord.Client({autoReconnect: conf.raw('bot/options/autoReconnect'), forceFetchUsers: conf.raw('bot/options/forceFetchUsers'), maxCachedMessages: conf.raw('bot/options/maxCachedMessages')});
var tagProcess  = new Tag();
var log         = function(prefix, msg){new Logger().log(prefix, msg);}

bot.on('message', function(message){
  try{
    cmdProcess.command(bot, message);
    tagProcess.tag(bot, message);
  } catch(exception){
    log('ERROR', exception);
  }
});

/**
bot.on('presence', function(o, n){
  if((n.game != o.game) && (n.game != null)){
    var r = new Roles(bot, null, n);
    r.addToRole(r.resolve(n.game['name']));
  }
});
*/

bot.on('ready', function(){
  log('STATUS', conf.get('bot/name') + conf.get('bot/version') + ' has connected successfully, and is online.');
  bot.servers.forEach(function(server){
    new Roles(bot).createGameRolesIfNotExists(server);
  });
  bot.joinServer(conf.get('bot/defaultServer'));
});

if(conf.raw('account/oauth')){
  bot.loginWithToken(conf.get('account/oauth-token'));
} else {
  bot.login(conf.get('account/username'), conf.get('account/password'));
}
