###
  Allows the user to opt-in to tagging
###

path = require 'path'
UserProfile = require path.join __dirname, '../', 'user'

module.exports =
  action: (client, args, message) ->
    profile = new UserProfile message.author
    profile.update ['options.tag'], ['true']

    message.reply "You've successfully opted in for recieving game tags."

    undefined
  alias: ['']
  description: 'Opt-in to game tagging'
