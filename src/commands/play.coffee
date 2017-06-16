###
  Work in progress, will allow the user to queue a song
###

path = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env) ->
    if args[0]?
      queue = new Queue(message.guild)
      if queue.addToQueue args[0]
        queue.play message.member.voiceChannel

    true
  alias: []
  description: 'Add audio source to queue'
  environment: ['DISCORD']
