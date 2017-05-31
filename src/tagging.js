const Games = new (require('./games.js'));
const UserProfile = require('./user.js');
const Database = new(require('./database.js'))

class Tags{
  parse(message){
    /*
      Check if message is tag, then parse

      TODO/QUESTION: Implement fuzzy search function to
        find mispellings or common derivations of names.

      QUESTION: Change from '@' to another symbol?
        Discord's usage of '@' interferes and hinders with the
          user's ability to type out a game's title quickly and
          without interruption.
    */
    let content = message.content.split(' ');
    let game = '';
    for(let word of content){
      if(!word.startsWith('@')) continue;
      game = word.substring(1, word.length);
    }
    if(!game || game == 'here' || game == 'everyone') return;

    console.log("[.abot8] Tag parsed...");
    (Games.find(game) != null) ? this.tag(Games.find(game), message) : this.tag(game, message);
  }

  async getUsers(game, message){
    /*
    CHANGED: 2017.5.2 Update - Instead of creating new instances of
      user profiles, getUsers now queries the database once, reducing
      load on the database. This has resulted in the reduction of the
      response time of tagging by up to 5-10ms per user.
    */
    let found = [];
    let users = await Database.find('users', {});
    for(let member of message.guild.members.values()){
      if(member.id == message.author.id) continue;
      for(let user of users){
        if(user.options.tag != 'true') continue;
        if(member.id == user.id)
          if(user.games.indexOf(game.toUpperCase()) > -1)
            found.push(member.user.toString());
      }
    }
    return found;
  }

  async tag(game, message){
    let users = await this.getUsers(game, message);
    if(users.length == 0){
      message.reply(` no one else has played "${game}" or everyone else has opted out. To opt in do \`!opt-in\``);
    } else {
      message.channel.send(`<@${message.author.id}> has tagged you for '${game}'\n\t${users.join('\t')}`);
    }
  }
}

module.exports = Tags;
