path = require 'path'
UserProfile = require path.join __dirname, 'user'
gameListPath = path.join __dirname, 'config/games.json'
GameList = require gameListPath

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
    # Searches against games.json to find a game via abbreviation
    for role of GameList
      for i in [0...GameList[role].length]
        return role if String(game).toUpperCase() == GameList[role][i].toUpperCase()

    null

  refresh: () ->
    console.log "[.abot8] Unloading games.json"
    GameList = undefined
    delete require.cache[require.resolve gameListPath]
    GameList = require gameListPath
    console.log "[.abot8] Loaded games.json"

    undefined

module.exports = Games
