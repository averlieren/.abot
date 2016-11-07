//replaces gameroles.js
var Discord  = require('discord.js');
var roleList = {
  "Counter-Strike: Global Offensive": {
    "id": 1,
    "alias": [
      "csgo",
      "cs",
    ]
  },
  "Overwatch": {
    "id": 2,
    "alias": [
      "ow",
    ]
  },
  "Hearthstone": {
    "id": 3,
    "alias": [
      "hs",
    ]
  },
  "osu!": {
    "id": 4,
    "alias": [
      "osu",
    ]
  },
  "League of Legends": {
    "id": 5,
    "alias": [
      "league",
      "lol",
    ]
  },
  "Unturned": {
    "id": 6,
    "alias": []
  },
  "Smash": {
    "id": 7,
    "alias": []
  },
  "Brawlhalla": {
    "id": 8,
    "alias": [
      "brawl",
    ]
  },
  "Garry's Mod": {
    "id": 9,
    "alias": [
      "gmod",
    ]
  },
  "Terraria": {
    "id": 10,
    "alias": []
  },
  "World of Warcraft": {
    "id": 11,
    "alias": [
      "wow",
      "warcraft"
    ]
  },
  "Rumble Fighter": {
    "id": 12,
    "alias": [
      "rumble",
      "rf"
    ]
  },
}

function Roles(bot, message, user){
  this.bot      = bot;
  this.roleList = roleList;
  message       = message || null;
  user          = user || null;
  if(message != null){
    this.message  = message;
    this.user     = message.sender;
    if(this.message.channel instanceof Discord.TextChannel)
      this.server = this.message.channel.server;
  } else if(message == null && user != null){
    this.user = user;
  }
}

Roles.prototype.list = function(){
  var listOfRoles = "";
  for(var e in this.roleList){
    var alias = this.roleList[e].alias != "" ? ", " + String(this.roleList[e].alias).replaceAll(',', ', ') : "";
    listOfRoles += e + " (ID: " + this.roleList[e].id + alias + ")\n";
  }
  return "\nList of Game Roles\n\n" + listOfRoles;
}

Roles.prototype.resolve = function(find){
  var role;
  var server = this.server;
  var findRole = function(e){
    server.roles.forEach(function(r){
      if(r.name === e)
        role = r;
    });
  }
  for(var e in this.roleList){
    if(e.toLowerCase() == find.toLowerCase()){
      findRole(e);
    } else if(this.roleList[e].id == Number(find)){
      findRole(e);
    } else {
      this.roleList[e].alias.forEach(function(l){
        if(l.toLowerCase() === find.toLowerCase()){
          findRole(e);
        }
      });
    }
  }
  return role;
}

Roles.prototype.addToRole = function(role){
  this.bot.addUserToRole(this.user, role);
  return "You were added to " + role.name;
}

Roles.prototype.removeFromRole = function(role){
  this.bot.removeUserFromRole(this.user, role);
  return "You were removed from " + role.name;
}

Roles.prototype.modifyGameRoles = function(role){
  var r = this.resolve(role);
  if(r != null){
    if(this.server.rolesOfUser(this.user).indexOf(r) > -1){
      return this.removeFromRole(r);
    } else {
      return this.addToRole(r);
    }
  }
  return "Invalid game given.";
}

Roles.prototype.createGameRolesIfNotExists = function(server){
  for(var role in roleList){
    var found = false;
    server.roles.forEach(function(r){
      if(r.name === role) found = true;
    });
    if(!found) this.bot.createRole(server, {name: role}, function(e, r){
      if(r.name != role){
        this.createGameRolesIfNotExists(server);
        this.bot.deleteRole(r);
        return;
      }
    });
  }
}

String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

module.exports = Roles;
