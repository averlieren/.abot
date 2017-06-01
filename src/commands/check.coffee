path = require 'path'
UserProfile = require path.join __dirname, '../', 'user'
Embeds = new (require path.join __dirname, '../', 'embeds')

module.exports =
  action: (client, args, message) ->
    profile = new UserProfile message.author
    games = await profile.get 'games'
    status = await profile.get 'options/tag'

    message.channel.send '', Embeds.generate '.abot', "Status: #{if status.toUpperCase() == 'TRUE' then 'opted in' else 'opted out'}, Games: #{games}"

    undefined
  alias: ['']
  description: 'Checks opt-in status and games attached to your profile'
