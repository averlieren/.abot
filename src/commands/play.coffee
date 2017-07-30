path  = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env, connection) ->
    if args[0]?
      queue = new Queue(message.guild)
      if await queue.addToQueue args[0]
        queue.play client, message.member.voiceChannel

    true
  alias: []
  description: 'Queue a YouTube video'
  environment: ['DISCORD']
