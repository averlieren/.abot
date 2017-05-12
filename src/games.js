const UserProfile = require('./user.js');
const List = require('./config/roles.json');

class Games{
  async addToGame(member){
    let profile = new UserProfile(member.user);
    let currentGames = await profile.get('games');
    let game = member.presence.game.name.toUpperCase();
    if(currentGames.indexOf(game) != -1) return;
    currentGames.push(game);
    profile.update(
      ['games'],
      [currentGames]
    )
  }

  find(game){
    /*
      CHANGED: 2017.5.5 Update: Lookup table no longer uses ids, and no longer has a key 'alias'.
        Aliases are now an array directly under the game's name. This was changed as games are now
        automatically detected and added under presenceUpdate event.

      NOTE: Lookup table, incase if abbreviation or alternate spelling is used.
    */
    for(let role in List)
      for(let i = 0; i < List[role].length; i++)
        if(String(game).toUpperCase() == List[role][i].toUpperCase()) return role;
    return null;
  }
}

module.exports = Games;
