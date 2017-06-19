path = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env) ->
    queue = new Queue message.guild
    if queue.isPlaying()
      dispatcher = queue.getDispatcher()
      if dispatcher.paused then dispatcher.resume() else dispatcher.pause()
    true
  alias: ['unpause']
  description: 'Pauses or unpauses current audio stream'
  environment: ['DISCORD']
