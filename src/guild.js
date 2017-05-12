/*
  TODO: Also finish this.
*/

const Database = new (require('./database.js'));

class Guild {
  constructor(guild){
    this._guild = guild;
  }

  async retrieve(){
    /*
      Retrieves guild data from database.
    */
    return await Database.first('guilds', {'id': this._guild.id});
  }

  async check(){
    /*
      Checks if server exists in 'guilds' collection
    */
    let doc = await this.retrieve();
    return (doc == null) ? false : true;
  }

  async setup(){
    /*
      If check fails, setup new guild profile in 'guilds' collection
    */
    if(await this.check()) return;
    let data = {}
    let guild = this._guild;

    console.log(`[.abot8] Performing first time setup for "${guild.name}"`);

    data['id'] = guild.id;

    data['queue'] = {}
  }

  async update(keys, values){
    /*
      CHANGED: 2017.5.5 Update: Split 'fields' object into two separate arrays,
        allowing to update faster by allowing more items to be changed.
    */
    let field = {};
    for(let i = 0; i < keys.length; i++) field[keys[i]] = values[i];
    field['data.lastsave'] = ((new Date()).getTime() / 1000).toFixed(0);
    Database.update('users', {'id': this._user.id}, {$set: field});
  }

  async get(path){
    /*
      Retrieves userdata document from 'users' collection and
        finds data at given path.
    */
    if(!await this.check()) return;
    let exists = await this.check();
    if(!exists) return;

    let doc = await this.retrieve();
    path = path.split('/');
    for(let i = 0; i < path.length; i++) if(doc[path[i]]) doc = doc[path[i]];
    return doc;
  }
}

module.exports = Guild;
