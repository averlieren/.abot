const fs = require('fs');
const cmdDir = 'C:/Users/Brandon/Desktop/DiscordJSBot/bot8/src/commands/';
//TODO: Remove `cmdDir`, replace with config system.
var m = CommandManager.prototype;

function CommandManager(client){
  this._client = client;
  m.fetchCommands();
}

m.fetchCommands = () =>{
  this._commands = {};
  fs.readdir(cmdDir, (e, files) =>{
    files.forEach(f =>{
      this._commands[f.replace('.js', '')] = require(cmdDir + f);
    });
  });
}

m.parse = message =>{
  if(message.author.bot || !message.content.startsWith('!')) return;
  var content = message.content.split(' ');
  m.run(content[0].replace('!', ''), content.dshift(), message);
}

m.find = command =>{
  for(var k in this._commands)
    if(k == command || this._commands[k].alias.indexOf(command) > -1) return k;
  return false;
}

m.run = (command, args, message) =>{
  var command = m.find(command);
  if(!command) return;
  this._commands[command].action(this._client, args, message);
  console.log('executed command: ' + command);
}

Array.prototype.dshift = function() {
    this.shift()
    return this;
}
module.exports = CommandManager;
