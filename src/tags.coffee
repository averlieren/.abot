path = require 'path'
Database = new (require path.join __dirname, 'database')
Embeds = new (require path.join __dirname, 'embeds')
Games = new (require path.join __dirname, 'games')

class Tag
  parse: (message) ->
    # Check if message contains tag, if so then parse tag
    # TODO: Implement fuzzy search
    # QUESTION: Change tagging symbol to not interfere with native Discord functionality
    content = message.content.split ' '
    game = undefined
    for word in [0...content.length]
      continue if !content[word].startsWith '@'
      game = content[word].substring 1, content[word].length

    return undefined if !game || game == 'here' || game == 'everyone' || /(#|!|@|#|\$|%|\^|&|\*|\(|\))/.test game

    console.log "[.abot8] Tag parsed..."
    if Games.find(game) != null
      @tag Games.find(game), message
    else
      @tag game, message

    undefined

  getUsers: (game, message) ->
    # Search users' games to find matching game
    found = []
    users = await Database.find 'users', {}

    message.guild.members.forEach (member,_) =>
      if member.id != message.author.id && !message.author.bot
        users.forEach (user, _) =>
          if user.options.tag == 'true'
            found.push member.user.toString() if member.id == user.id && user.games.indexOf(game.toUpperCase()) > - 1

    found

  tag: (game, message) ->
    users = await @getUsers game, message
    if users.length == 0
      message.reply " no one else has played \"#{game}\", or no one has opted in."
    else
      message.channel.send "", Embeds.generate ".abot", "<@#{message.author.id}> has tagged you for '#{game}'\n\t#{users.join '\t'}", "0xFFB500"

    undefined

module.exports = Tag
