const Data    = require('./data.js');
const roles   = require('./config/roles.json');

function getRole(e){
  for(var r in roles)
    if(e == r)
      return r;
}

module.exports = {
  list: function(){
    var rolesList = [];
    for(var r in roles){
      var aliases = (typeof roles[r].alias != 'undefined') ? `, ${roles[r].alias.join(', ')}` : '';
      rolesList += `${r} (ID: ${roles[r].id + aliases})\n`;
    }
    return rolesList;
  },
  userRoles: function(user){
    return Data.get(user, 'games');
  },
  resolve: function(find){
    var role;
    for(var e in roles){
      if((e.toLowerCase() == String(find).toLowerCase()) || (roles[e].id == Number(find))){
        role = getRole(e);
      } else {
        if(typeof roles[e].alias != 'undefined')
          roles[e].alias.forEach(function(r){
            if(r.toLowerCase() == String(find).toLowerCase())
              role = getRole(e);
          });
      }
    }
    return role;
  },
  hasRole: function(user, role){
    return Data.get(user, 'games').indexOf(role) > -1;
  },
  addToRole: function(user, role){
    if(this.hasRole(user, role)) return;
    var roles = Data.get(user, 'games');
    roles.push(role);
    Data.set(user, {'games': roles});
  },
  removeFromRole: function(user, role){
    if(!this.hasRole(user, role)) return;
    var roles = Data.get(user, 'games');
    roles.splice(roles.indexOf(role), 1);
    Data.set(user, {'games': roles});
  },
  toggleRole: function(user, role){
    if(this.resolve(role) == null) return null;
    if(this.hasRole(user, role)){
      this.removeFromRole(user, role);
      return false;
    } else {
      this.addToRole(user, role);
      return true;
    }
  }
}
