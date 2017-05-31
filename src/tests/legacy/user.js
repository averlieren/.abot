const Database = new (require('./database.js'));

/*
  MongoDB Document Structure:

  id
  data
    accountCreated
    discriminator
    username
  permissions
    server
      server1
        group
          permissions [node1, node2, ..., nodeN]
      server2
        group
          permissions [node1, node2, ..., nodeN]
      ...
      serverN
        group
          permissions [node1, node2, ..., nodeN]
    global
      group
      permissions [node1, node2, ..., nodeN]
  options
    tag
    muted
    queue
  games [game1, game2, ..., gameN]
*/

class User{
  constructor(user){
    this._user = user;
  }

  async retrieve(){
    /*
      Attempts to retrieve userdata from 'users' collection in database.
    */
    return await Database.first('users', {'id': this._user.id});
  }

  async check(){
    /*
      Checks if userprofile exists within 'users' collection.
    */
    let doc = await this.retrieve();
    return (doc == null && !this._user.bot) ? false : true;
  }

  async setup(){
    /*
      If check fails, setup new userprofile in 'users' collection.
    */
    if(await this.check()) {
      if(await this.get('data/username') != this._user.username) this.update(['data.username'], [this._user.username]);
      return;
    };
    let data = {};
    let user = this._user;

    console.log(`[.abot8] Performing first time setup for "${user.username}".`);

    data['id'] = user.id;

    data['data'] = {
      'lastSave': ((new Date()).getTime() / 1000).toFixed(0),
      'accountCreated': ((user.id / 4194304) + 1420070400000).toFixed(0),
      'discriminator': user.discriminator,
      'username': user.username
    }

    data['options'] = {
      'tag': "false",
      'muted': "-1",
      'queue': "true"
    }

    data['permissions'] = {
      'server': {},
      'global': {
        'group': 'default',
        'permissions': []
      }
    }

    data['games'] = [];

    Database.insert('users', data);
  }
  async update(keys, values){
    /*
      CHANGED: 2017.5.5 Update: Split 'fields' object into two separate arrays,
        allowing to update faster by allowing more items to be changed.
    */
    let field = {};
    for(let i = 0; i < keys.length; i++) field[keys[i]] = values[i];
    field['data.lastSave'] = ((new Date()).getTime() / 1000).toFixed(0);
    Database.update('users', {'id': this._user.id}, {$set: field});
  }

  async get(path){
    /*
      Retrieves userdata document from 'users' collection and
        finds data at given path.
    */
    let check = await this.check();
    if(!check) return;
    let doc = await this.retrieve();
    path = path.split('/');
    for(let i = 0; i < path.length; i++) if(doc[path[i]]) doc = doc[path[i]];
    return doc;
  }
}

module.exports = User;
