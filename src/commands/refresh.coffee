###
  Refreshes commands, allowing commands to be modified, added or removed
    without restarting the client.
###

path     =      require 'path'
Commands =      require path.join __dirname, '../', 'commands'
Games    =      require path.join __dirname, '../', 'games'
Config   = new (require path.join __dirname, '../', 'config'  )()

module.exports =
  action: (client, args, message, env, connection) ->
    Games    = new Games    connection
    Commands = new Commands connection, client

    Commands.refresh()
    Games.refresh()
    Config.refresh()

    true
  alias: []
  description: 'Refresh commands'
  environment: ['DISCORD', 'CLI']
