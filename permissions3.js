var permission = require('./config/permissions.json');

function Permissions(server){
  this.server = server;
}

var getInheritance = function(group){
  return permission.groups[group].inherit;
}

var hasInheritance = function(group){
  return (getInheritance(group) != '') ? true : false;
}

var getInheritanceTree = function(group){
  var inherited = [group];
  while(hasInheritance(group)){
    group = getInheritance(group);
    inherited.push(group);
  }
  return inherited;
}

var exists = function(user){
  return permission.users.hasOwnProperty(user);
}

var getUserPermissions = function(user){
  return permission.users[user].permissions;
}

Permissions.prototype.refresh = function(){
  permission = require('./config/permissions.json');
}

Permissions.prototype.hasGroup = function(user){
  return (exists(user) && permission.users[user].group.length > -1) ? true : false;
}

Permissions.prototype.getPermissions = function(user){
  var permissions = getUserPermissions(user);
  if(this.hasGroup(user)){
    var groupPermissions = function(group){
      return (permission.groups[group].permissions.length > -1) ? permission.groups[group].permissions : [];
    };
    for(var i = 0; i < permission.users[user].group.length; i++){
      var group = permission.users[user].group[i];
      getInheritanceTree(group).forEach(function(inherit){
        groupPermissions(inherit).forEach(function(perm){
          if(permissions.indexOf(perm) < 0)
            permissions.push(perm);
        });
      });
    }
  }
  return permissions;
}

Permissions.prototype.hasPermission = function(user, find){
  if(exists(user) && permission.users[user].server != null && (permission.users[user].server.indexOf(this.server) > -1 || permission.users[user].server.indexOf('*') > -1)){
    return (this.getPermissions(user).indexOf(find) > -1 || this.getPermissions(user).indexOf('*') > -1) ? true : false;
  }
  return false;
}

module.exports = Permissions;
