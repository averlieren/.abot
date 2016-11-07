const Discord     = require('discord.js');
require('coffee-script').register();
const path        = require('path');
const Config      = require('./config.coffee');
const Logger      = require('./logger.js');
const Permissions = require('./permissions.js');
const ytdl        = require('ytdl-core');
const fs          = require('fs');
const disabledCmd = Config.raw('commands/disabled');

module.exports = {
  check: function(file, user, server){
    var req = file.permission;
    if(req.indexOf('any') > -1 || Permissions.groupHasPermission('everyone', req)) return true;
    return Permissions.hasPermission(user, server, req);
  },
  execute(bot, message, cmd, args, file){
    if(disabledCmd.indexOf(cmd) != -1) return;
    if(this.check(file, message.sender.id, message.channel.server.id)) file.action(bot, message, args); else this.reply(bot, message, 'You lack the required permissions.', 3500);
    Logger.log('info', `(exec) ${message.sender.name} (ID: ${message.sender.id}) executed ${message.content}`);
  },
  command: function(bot, message){
    if(message.content.startsWith(Config.get('commands/prefix'))){
      var commands = this.getCommands();
      var args     = message.content.split(' ');
      var cmd      = args[0].replace('!', '');
      var parent   = this;
      commands.forEach(function(file){
        var cmdFile = require(Config.get('directories/default') + 'commands' + path.sep + file);
        if(file.replace('.js', '').toUpperCase() == cmd.toUpperCase() || (cmdFile.alias.length > 0 && cmdFile.alias.join(' ').toUpperCase().split(' ').indexOf(cmd.toUpperCase()) > -1)) parent.execute(bot, message, cmd, args, cmdFile);
      });
    }
  },
  getCommands: function(){
    return fs.readdirSync(Config.get('directories/default') + 'commands');
  },
  reply: function(bot, message, send, delay){
    bot.sendMessage(message.channel, message.sender.mention() + ' ' + send, function(err, msg){
      if(delay && !isNaN(delay)){
        bot.deleteMessage(msg, {wait: delay});
        bot.deleteMessage(message, {wait: delay});
      }
    });
  },
  playSound: function(bot, message, audio, type, vol){
    type = type || false;
    vol  = vol  || 0.2;
    if(message.channel instanceof Discord.TextChannel){
      if(message.sender.voiceChannel == null) return;
      var server  = message.channel.server;
      var channel = message.sender.voiceChannel;
      var stream  = undefined;
      if(type == 'youtube'){
        stream = ytdl(audio, {filter: 'audioonly'});
      } else if(type == 'other'){
        stream = audio;
      } else {
        if(fs.lstatSync(audio).isDirectory()){
          fs.readdir(Config.get('directories/default') + audio, function(err, file){
            stream = Config.get('directories/default') + audio + path.sep + file[Math.floor(Math.random() * file.length)];
          });
        } else {
          stream = Config.get('directories/default') + audio;
        }
      }
      try{
        bot.joinVoiceChannel(channel, function(e, c){
          if(type == 'youtube' || type == 'other'){
            c.playRawStream(stream, {volume: vol});
          } else {
            c.playFile(stream, {volume: vol});
          }
        });
      } catch(e){
        Logger.log('info', `err (sound) => ${e}`);
      }
    }
    bot.deleteMessage(message, {wait: 3000});
  }
}
