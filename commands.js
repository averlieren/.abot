var Config      = require('./config.js');
var Logger      = require('./logger.js');
var Permissions = require('./permissions3.js');
var Roles       = require('./roles.js');

var path        = require('path');
var Discord     = require('discord.js');
var fs          = require('fs');
var request     = require('request');
var ytdl        = require('ytdl-core');

var conf        = new Config();
var prefix      = conf.get('prefix');
var llog        = new Logger();
var log         = function(prefix, msg){llog.log(prefix, msg);}

function Commands(){

}

Commands.prototype.command = function(bot, message){
  var reply     = function(send, time){
    time = time || -1;
    if(time < 0){
      bot.sendMessage(message.channel, message.sender.mention() + ' ' + send);
    } else {
      bot.deleteMessage(message, {wait: time});
      bot.sendMessage(message.channel, message.sender.mention() + ' ' + send, function(e, m){
        bot.deleteMessage(m, {wait: time});
      });
    }
  }
  var playSound = function(dir, stream, audioVolume){
    stream      = stream || false;
    audioVolume = audioVolume || 0.3;
    if(message.channel instanceof Discord.TextChannel){
      var server = message.channel.server;
      var vc     = undefined;
      server.members.forEach(function(user){
        if(message.sender.id === user.id && user.status === "online" && user.voiceChannel != null)
          vc = user.voiceChannel;
      });
      try{
        if(vc != undefined){
          bot.joinVoiceChannel(vc, function(e, c){
            if(stream){
              c.playRawStream(ytdl(dir, {filter: 'audioonly'}), {volume: audioVolume});
            } else if(fs.lstatSync(dir).isDirectory()){
              fs.readdir(conf.get('directories/defaultDir') + path.sep + dir, function(r, f){
                var rand = f[Math.floor(Math.random() * f.length)];
                c.playFile(conf.get('directories/defaultDir') + path.sep + dir + path.sep + rand, {volume: audioVolume});
              });
            } else if(fs.lstatSync(dir).isFile()) {
              c.playFile(conf.get('directories/defaultDir') + path.sep + dir, {volume: audioVolume});
            }
          });
        }
      } catch(exception){
        log('VOICE ERROR', exception);
      }
      bot.deleteMessage(message, {wait: 3500});
    }
  }
  var check = function(cmd){
    var requiredPerm = commands[cmd].permissions;
    if(requiredPerm.indexOf('all') > -1){
      return true;
    } else {
      var required    = requiredPerm.length;
      var found       = 0;
      requiredPerm.forEach(function(r){
        if(perm.hasPermission(message.sender.id, r))
          found++;
      });
      if(found == required){
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  var commands  = {
    "airhorn": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/airhorn'));
      },
      "description": "Plays an airhorn.",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [
        "ah",
      ],
    },
    "amerika": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/amerika'));
      },
      "description": "Amerika!",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "coin": {
      "command": function(message, args){
        reply(Math.floor(Math.random() * 2) == 0 ? 'Heads' : 'Tails', 15000);
      },
      "description": "Tosses a coin.",
      "permissions": [
        "all",
      ],
      "alias": [
        "toss",
      ],
    },
    "eb": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/eb'));
      },
      "description": "ETHAN BRADBERRY.",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "fuck": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/fuck'));
      },
      "description": "fucker",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "g": {
      "command": function(message, args){
        if(args[0].toLowerCase() === "list"){
          reply(new Roles(bot, message).list(), 30000);
        } else {
          reply(new Roles(bot, message).modifyGameRoles(args.join(' ').trim()), 5000);
        }
      },
      "description": "Join/leave a game role.",
      "permissions": [
        "all",
      ],
      "alias": [
        "game",
      ],
    },
    "hello": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/hello'));
      },
      "description": "HELLO, NOT GETTING ENOUGH OOMPH OUT OF YOUR ENERGY DRINK?",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "help": {
      "command": function(message, args){
        var cmdRem   = conf.raw('disabled-commands');
        var cmdList  = "";
        var cmdAmt   = Object.keys(commands).length - cmdRem.length;
        var cmdPages = Math.ceil(cmdAmt / 5);
        var curPage  = (args[0] != undefined) ? Number(args[0]) : 1;
        var count    = 0,
            min      = (curPage < cmdPages) ? (((curPage - 1) * 5) > -1) ? ((curPage - 1) * 5) : 0 : (curPage == cmdPages) ? ((cmdPages - 1) * 5) : 0,
            max      = min + 5;
        if(curPage < 1 || (!(curPage < cmdPages) && !(curPage == cmdPages)))
          curPage = 1;

        for(var c in commands){
          if(cmdRem.indexOf(c) < 0){
            if(count >= min && count < max){
              hasPerms = check(c) ? "✓" : "✘";
              if(commands[c].alias.length > 0){
                cmdList += prefix + c + " : " + commands[c].description + "\n\tPermission: " + hasPerms + "\n\tAliases: " + commands[c].alias.join(', ') + "\n\n";
              } else {
                cmdList += prefix + c + " : " + commands[c].description + "\n\tPermission: " + hasPerms + "\n\n";
              }
            }
            count++;
          }
        }
        reply("\n**List of Commands:**\n" + cmdList + "**Page " + curPage + " of " + cmdPages + "**", 15000);
      },
      "description": "List of commands",
      "permissions": [
        "all",
      ],
      "alias": [
        "commands",
      ],
    },
    "join": {
      "command": function(message, args){
        bot.joinServer(args[0], function(e, s){
          if(e){
            reply('Error in joining server using invite code "' + args[0] + '"', 10000);
          } else {
            reply('Successfully joined ' + s.name, 10000);
          }
        });
      },
      "description": "Joins another server using an invite code.",
      "permissions": [
        "joinServer",
      ],
      "alias": [
        "joinserver",
        "invite"
      ],
    },
    "joke": {
      "command": function(message, args){
        request("http://tambal.azurewebsites.net/joke/random", function(error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            reply(result.joke, 20000);
          }
        });
      },
      "description": "Lame \"randomly\" generated jokes.",
      "permissions": [
        "all",
      ],
      "alias": [],
    },
    "kancho": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/kancho'));
      },
      "description": "KANCHO!",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "leave": {
      "command": function(message, args){
        reply("Leaving current server.");
        bot.leaveServer(message.channel.server);
      },
      "description": "Leaves current server.",
      "permissions": [
        "leaveServer",
      ],
      "alias": [
        "ls",
      ],
    },
    "missionreport": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/missionreport'));
      },
      "description": "December 16, 1991",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [
        "december",
        "report",
        "mission",
      ],
    },
    "motd": {
      "command": function(message, args){
        if(args[0].toLowerCase() === "set"){
          var msg = message.content;
          if(perm.hasPermission(message.sender.id, "editMOTD")){
            fs.writeFile(conf.get('directories/defaultDir') + path.sep + conf.get('directories/motd'), msg.substr(msg.indexOf(' ', 9)).trim());
            reply("\nServer MOTD has been set to \"" + msg.substr(msg.indexOf(' ', 9)).trim() + "\"", 10000);
          }
        } else {
          fs.readFile(conf.get('directories/defaultDir') + path.sep + conf.get('directories/motd'), 'utf8', function (e, data) {
            reply("\nServer MOTD:\n" + data, 10000);
          });
        }
      },
      "description": "Server's message of the day!",
      "permissions": [
        "all",
      ],
      "alias": [],
    },
    "murloc": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/murloc'));
      },
      "description": "murloc",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "ping": {
      "command": function(message, args){
        reply("pong!", 5000);
      },
      "description": "pong",
      "permissions": [
        "all",
      ],
      "alias": [],
    },
    "quit": {
      "command": function(message, args){
        reply("Shutting down!", 2500);
        setTimeout(function(){
          bot.logout();
        }, 5000);
      },
      "description": "Shuts down the bot",
      "permissions": [
        "quitBot",
      ],
      "alias": [],
    },
    "soundboard": {
      "command": function(message, args){
        if(args){
          playSound(conf.get('directories/soundboard/soundboard') + '/' + args[0]);
        } else {
          playSound(conf.get('directories/soundboard/soundboard'));
        }
      },
      "description": "Picks and plays a random sound from the soundboard.",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [
        "sb",
      ],
    },
    "stopsound": {
      "command": function(message, args){
        if(bot.voiceConnection != null){
          bot.voiceConnection.stopPlaying();
        }
        bot.deleteMessage(message, {wait: 5000});
      },
      "description": "Stops the audio that is playing.",
      "permissions": [
        "canStopAudio",
      ],
      "alias": [
        "stop",
        "end",
      ],
    },
    "taps": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/taps'));
      },
      "description": "They talk about my one taps.",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "youtube": {
      "command": function(message, args){
        playSound(args[0], true);
      },
      "description": "Play a youtube video's audio.",
      "permissions": [
        "streamAudio",
      ],
      "alias": [
        "yt",
        "play",
        "video",
      ],
    },
    "togethertube": {
      "command": function(message, args){
        reply("TogetherTube: " + conf.get('togethertube'), -1);
      },
      "description": "Togethertube, together.",
      "permissions": [
        "all",
      ],
      "alias": [],
    },
    "weather": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/weather'));
      },
      "description": "weather",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "who": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/whoareyou'), true);
      },
      "description": "Who the fuck are you?",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
    "roasted": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/roasted'));
      },
      "description": "roasted",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [
        "roast"
      ],
    },
    "wednesday": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/wednesday'));
      },
      "description": "wednesday",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [
        "wed"
      ],
    },
    "dragon": {
      "command": function(message, args){
        playSound(conf.get('directories/soundboard/dragon'));
      },
      "description": "dragon",
      "permissions": [
        "canUseVoice",
      ],
      "alias": [],
    },
  }

  var msg = message.content;
  if(msg.startsWith(prefix)){
    var cmd     = message.content.split(' ')[0].replace('!', '').toLowerCase();
    var args    = message.content.replace('!', '').replace(cmd, '').trim().split(' ');
    var perm    = new Permissions(message.channel.server.id);
    var execute = function(cmd){
      var disabledCmd  = conf.raw('disabled-commands');
      if(disabledCmd.indexOf(cmd) < 0){
        if(check(cmd)){
          commands[cmd].command(message, args);
          log('EXEC', message.content);
        } else {
          reply('You do not have the required permissions.', 3500);
        }
      }
      return true;
    };
    if(commands.hasOwnProperty(cmd)){
      execute(cmd);
    } else {
      for(var k in commands){
        if(commands[k].alias.indexOf(cmd.toLowerCase()) > -1)
          execute(k);
      }
    }
  }
  return false;
}

String.prototype.startsWith = function(pf){
  return this.slice(0, prefix.length) == pf;
}
module.exports = Commands;
