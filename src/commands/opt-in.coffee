###
  Allows the user to opt-in to tagging
###

path = require 'path'
UserProfile = require path.join __dirname, '../', 'user'

module.exports =
  action: (client, args, message, env) ->
    profile = new UserProfile message.author
    profile.update ['options.tag'], ['true']

    message.reply "You've successfully opted in for receiving game tags."

    true
  alias: []
  description: 'Opt-in to game tagging'
  environment: ['DISCORD']
