###
  Refreshes commands, allowing commands to be modified, added or removed
    without restarting the client.
###

path = require 'path'
Commands = require path.join __dirname, '../', 'commands'

module.exports =
  action: (client, args, message, env) ->
    cmdMgr = new Commands client
    cmdMgr.refreshCommands()

    undefined
  alias: ['']
  description: 'Refresh commands'
  environment: ['DISCORD', 'CLI']
