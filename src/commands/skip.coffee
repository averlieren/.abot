path  = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env, connection) ->
    new Queue(message.guild).skip()

    true
  alias: []
  description: 'Skip the current song'
  environment: ['DISCORD']
