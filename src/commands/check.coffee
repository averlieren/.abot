###
  Debug command, allows user to view tagging status (opted in or out)
    and games attached to user profile.
###

path   =      require 'path'
User   =      require path.join __dirname, '../', 'user'
Embeds = new (require path.join __dirname, '../', 'embeds')()

module.exports =
  action: (client, args, message, env, connection) ->
    profile = new User connection, message.author
    games   = await profile.get 'games'
    status  = await profile.get 'options/tag'
    message.channel.send '', Embeds.generate '.abot', "Status: #{if status.toUpperCase() == 'TRUE' then 'opted in' else 'opted out'}, Games: #{games}"

    true
  alias: []
  description: 'Checks opt-in status and games attached to your profile'
  environment: ['DISCORD']
