path = require 'path'
Commands = require path.join __dirname, 'commands'

class Input
  constructor: (Client) ->
    process.stdin.setEncoding 'utf8'
    Commands = new Commands Client

  listen: () ->
    console.log "[.abot8] Now listening to user input via CLI"
    process.stdin.on 'readable', () =>
      data = process.stdin.read()
      if data?
        @process data

    undefined

  process: (data) ->
    data = data.replace /[^\-\w\ ]/gi, ''
    Commands.parse data, 'CLI'

    undefined
module.exports = Input
