path = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message, env) ->
    new Queue(message.guild).skip()

    true
  alias: []
  description: 'Add audio source to queue'
  environment: ['DISCORD']
