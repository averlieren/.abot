const fs = require('fs');

class Commands{
  constructor(client){
    this._client = client;
  }

  fetchCommands(){
    /*
      Load commands into memory
    */
    this._commands = {};

    fs.readdir('./commands/', (e, files) => {
      for(let x = 0; x < files.length; x++){
        let f = files[x];
        this._commands[f.replace('.js', '')] = require('./commands/' + f);
      }
    })
    global.commands = this._commands;
  }

  parse(message){
    /*
      Check if message is command, then parse
    */
    if(!message.content.startsWith('!')) return;
    let content = message.content.split(' ');

    console.log("[.abot8] Command parsed, attemting to run...");

    this.run(content[0].replace('!', ''), content.dshift(), message);
  }

  find(command){
    /*
      Look for command if exists
    */
    for(var k in this._commands) if(k == command || this._commands[k].alias.indexOf(command) > -1) return k;
    return false;
  }

  run(command, args, message){
    console.log(`[.abot8] Attempting command execution "${command}"...`);
    command = this.find(command);
    if(!command) return;
    this._commands[command].action(this._client, args, message);
    console.log(`[.abot8] Command "${command}" succesfully executed.`);
  }
}

Array.prototype.dshift = function() {
    this.shift()
    return this;
}

module.exports = Commands;
