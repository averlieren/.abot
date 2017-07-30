###
  Allows the user to opt in/out to tagging
###

path = require 'path'
User = require path.join __dirname, '../', 'user'

module.exports =
  action: (client, args, message, env, connection) ->
    profile = new User connection, message.author
    current = await profile.get 'options/tag'

    if current == 'true'
      profile.update ['options.tag'], ['false']
      message.reply "You are no longer receiving game tags."
    else
      profile.update ['options.tag'], ['true']
      message.reply "You are now receiving game tags."

    true
  alias: []
  description: 'Opt in or out of tagging'
  environment: ['DISCORD']
