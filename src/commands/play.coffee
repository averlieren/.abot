###
  Work in progress, will allow the user to queue a song
###

path = require 'path'
Queue = require path.join __dirname, '../', 'queue'

module.exports =
  action: (client, args, message) ->
    undefined
  alias: ['']
  description: 'Add to queue'
