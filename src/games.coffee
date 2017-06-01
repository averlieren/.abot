path = require 'path'
UserProfile = require path.join __dirname, 'user'
GameList = require path.join __dirname, 'config/games.json'

class Games
  addToGame: (member) ->
    # Appends game to member's profile
    profile = new UserProfile member.user
    currentGames = await profile.get 'games'
    game = member.presence.game.name.toUpperCase()
    return undefined if currentGames.indexOf(game) != -1
    currentGames.push game
    profile.update ['games'], [currentGames]

    undefined

  find: (game) ->
    # Searchs against games.json to find a game via abbreviation
    for role of GameList
      for i in [0..GameList[role].length - 1]
        return role if String(game).toUpperCase() == GameList[role][i].toUpperCase()
        
    null

module.exports = Games
