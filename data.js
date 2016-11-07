require('coffee-script').register();
const fs     = require('fs');
const Config = require('./config.coffee');

module.exports = {
  set: function(user, modify){
    var userdata = JSON.parse(this.read(user));
    for(var m in modify)
      userdata[m] = modify[m];
    this.write(user, JSON.stringify(userdata));
  },
  get: function(user, item){
    return Config.retrieve(item, JSON.parse(this.read(user)));
  },
  defaults: function(user, userObject){
    try{
      fs.accessSync(`./userdata/${user}.json`, fs.F_OK);
    } catch(e){
      this.write(user, `{"games": [], "info": {"id": "${user}", "username": "${userObject.username}", "discriminator": "${userObject.discriminator}"}}`);
    }
  },
  write: function(user, data){
    stream = fs.createWriteStream(`./userdata/${user}.json`, {defaultEncoding: 'utf16le'});
    stream.write(data);
    stream.end();
  },
  read: function(user){
    return fs.readFileSync(`./userdata/${user}.json`, 'utf16le');
  }
}
