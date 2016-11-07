const Permissions = require('./config/permissions.json');

function getInheritance(group){
  return Permissions.groups[group].inherit;
}

function hasInheritance(group){
  return (getInheritance(group) != '') ? true : false;
}

function getInheritanceTree(group){
  var inherited = [group];
  while(hasInheritance(group)){
    group = getInheritance(group);
    inherited.push(group);
  }
  return inherited;
}

function exists(user){
  return Permissions.users.hasOwnProperty(user);
}

function getUserObject(user){
  return (exists(user)) ? Permissions.users[user] : null;
}

function getUserGroup(user, server){
  if(!exists(user)) return null;
  var data = getUserObject(user);
  if(data.server.hasOwnProperty(server)){
    return data.server[server].group;
  } else if(data.server.hasOwnProperty('*')){
    return data.server['*'].group;
  }

  return null;
}

function getUserPermissions(user, server){
  if(!exists(user)) return null;
  var data = getUserObject(user);
  var list = [];
  if(data.server.hasOwnProperty('*')){
    list = list.concat(data.server['*'].permissions);
  } else if(data.server.hasOwnProperty(server)){
    list = list.concat(data.server[server].permissions);
  }

  return list;
}

function groupPermissions(g) {
  return (Permissions.groups[g.toString()].permissions.length > -1) ? Permissions.groups[g.toString()].permissions : [];
}

function getGroupPermissions(group){
  var list = [];
  getInheritanceTree(group).forEach(function(inherit){
    groupPermissions(inherit).forEach(function(node){
      if(list.indexOf(node) == -1)
        list = list.concat(node);
    });
  });

  return list;
}

module.exports = {
  getPermissions: function(user, server){
    var list = getUserPermissions(user, server);
    if(getUserGroup(user, server) != null)
      list = list.concat(getGroupPermissions(getUserGroup(user, server)));
    return list;
  },
  hasPermission: function(user, server, node){
    if(!exists(user)) return false;
    return ((this.getPermissions(user, server).indexOf(node) > -1) || (this.getPermissions(user, server).indexOf('*') > -1)) ? true : false;
  },
  groupHasPermission: function(group, node){
    if(getGroupPermissions(group).length < 1) return false;
    return (getGroupPermissions(group).indexOf(node) > -1) ? true : false;
  }
}
