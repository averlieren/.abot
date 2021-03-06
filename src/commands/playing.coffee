path  = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env, connection) ->
    queue = new Queue message.guild
    if queue.isPlaying()
      message.channel.send '', queue.getPlaying(true)
    else
      message.reply 'Nothing is currently playing.'
    true
  alias: []
  description: 'Tells you what is being played right now'
  environment: ['DISCORD']
