fs = require 'fs'
path = require 'path'

class Commands
  constructor: (client) ->
    @client = client

  fetchCommands: () ->
    # Load commands

    @commands = {}
    fs.readdir path.join(__dirname, 'commands'), (e, files) =>
      for i in [0..files.length - 1]
        f = files[i]
        @commands[f.replace /(.js|coffee)/, ''] = require path.join __dirname, 'commands', f

    global.commands = @commands

    undefined

  parse: (message) ->
    # Check if message is command

    return undefined if !message.content.startsWith '!'
    content = message.content.split ' '

    console.log "[.abot8] Command parsed. attempting execution..."

    @run content[0].replace('!', ''), content.dshift(), message

    undefined

  find: (command) ->
    # Check if command exists
    for k in @commands
      if k.toUpperCase() == command.toUpperCase() || @commands[k].alias.indexOf(command.toLowerCase()) > -1
        return k
    false

  run: (command, args, message) ->
    console.log "[.abot8] Attempting to execute #{command}..."
    command = @find command

    return undefined if !command

    @commands[command].action @client, args, message

    console.log "[.abot8] #{command} executed successfully"

    undefined

Array.prototype.dshift = () ->
  @shift()
  return @

module.exports = Commands
