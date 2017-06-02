path = require 'path'
Commands = require path.join __dirname, 'commands'

class Input
  constructor: (Client) ->
    Commands = new Commands Client

  listen: () ->
    console.log "[.abot8] Now listening to user input via CLI"
    process.stdin.on 'readable', () =>
      data = process.stdin.read()
      if data != null
        @process(data)
        return undefined

    undefined
  process: (data) ->
    data = data.replace /[^a-z0-9]/gi, ''
    switch data.toUpperCase()
      when 'REFRESH'
        Commands.refreshCommands()
      else
        console.log "[.abot8] Unknown command"
    undefined
module.exports = Input
