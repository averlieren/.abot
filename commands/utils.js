var config

function Utils(bot, message){
    this.bot     = bot;
    this.message = message;
}

Utils.prototype.playSound = function(dir, audioVolume, isStream, ytdlEnable){
  audioVolume     = audioVolume   || 0.3;
  isSteram        = isStream || false;
  ytdlEnable      = ytdlEnable || false;
  bot             = this.bot;
  message         = this.message;

  if(message.channel instanceof Discord.TextChannel){
    var server  = message.channel.server;
    var channel = undefined;
    if(message.sender.voiceChannel != null) channel = message.sender.voiceChannel;
    try{
      if(channel != undefined){
        bot.joinVoiceChannel(channel, function(e, c){
          if(isStream){
            if(ytdlEnable){
              c.playRawStream(ytdl(dir, {filter: 'audioonly'}), {volume: audioVolume});
            } else {
              c.playRawStream(dir, {volume: audioVolume});
            }
          } else if(fs.lstatSync(dir).isDirectory()) {
            fs.readdir(conf.get('directories/defaultDir') + path.sep + dir, function(r, f){
              c.playFile(conf.get('directories/defaultDir') + path.sep + dir + path.sep + f[Math.floor(Math.random() * f.length)], {volume: audioVolume});
            });
          } else if(fs.lstatSync(dir).isFile()) {
            c.playFile(conf.get('directories/defaultDir') + path.sep + dir, {volume: audioVolume});
          }
        });
      }
    } catch(e){}
    bot.deleteMessage(message, {wait: 2000});
  }
}

module.exports = {
  playSound: function(bot, message, dir, volume, isStream){
    volume   = volume   || 0.3;
    isStream = isStream || false;

  },
  sendMessage: function(){

  },
  reply: function(){

  },
  log: function(){

  },
}
