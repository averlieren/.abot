fs = require 'fs'
path = require 'path'
Config = new (require path.join __dirname, 'config')

class Commands
  constructor: (client) ->
    @client = client

  refreshCommands: () ->
    # Refresh commands without restarting client

    console.log "[.abot8] Refreshing commands... unloading..."

    for own command, _ of global.commands
      console.log "[.abot8] \tUnloading \"#{command}\"..."
      delete require.cache[require.resolve path.join __dirname, 'commands', command]

    global.commands = undefined

    Config.refresh()
    @fetchCommands()

    undefined

  validate: (name, command) ->
    # Check if command is valid
    valid = true
    for property in ['action', 'alias', 'description']
      valid = false if !command[property]

    return true if valid

    console.log "[.abot8] Command \'#{name}\' failed validation, skipping initialization..."
    delete require.cache[require.resolve path.join __dirname, 'commands', name]

    false

  isCommand: (file) ->
    return true if /(.js|.coffee)/.test file

    console.log "[.abot8] Found file: #{file} in command folder... invalid file format..."

    false

  fetchCommands: () ->
    # Load commands
    console.log "[.abot8] Fetching commands..."
    global.commands = {}
    @disabled = Config.raw 'commands/disabled'

    fs.readdir path.join(__dirname, 'commands'), (e, files) =>
      console.log "[.abot8] The following commands have been disabled; skipping initialization..."
      console.log "[.abot8] \t#{@disabled.join ', '}"
      console.log "[.abot8] Loading commands..."
      for file in files
        continue if !@isCommand file
        name = file.replace /(.js|.coffee)/, ''
        continue if @disabled.indexOf(name) > - 1
        command = require path.join __dirname, 'commands', name
        continue if !@validate(name, command)
        console.log "[.abot8] \tLoaded \"#{name}\""
        global.commands[name] = command;
      true
      
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

    for k, _ of global.commands
      if k.toUpperCase() == command.toUpperCase() || global.commands[k].alias.indexOf(command.toLowerCase()) > -1
        return k

    false

  run: (command, args, message) ->
    console.log "[.abot8] Attempting to execute #{command}..."
    command = @find command

    return undefined if !command

    global.commands[command].action @client, args, message

    console.log "[.abot8] #{command} executed successfully"

    undefined

Array.prototype.dshift = () ->
  @shift()
  return @

module.exports = Commands
