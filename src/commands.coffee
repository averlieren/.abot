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

  indexCommand: (name) ->
    # Check if command is valid
    command = require path.join __dirname, 'commands', name

    invalid = false

    for property in ['action', 'alias', 'description', 'environment']
      invalid = true if !command[property]

    if !invalid
      global.commands[name] = command
      return true

    console.log "[.abot8] \x1b[31m\tSkipped \"#{name}\": failed validation\x1b[0m"
    delete require.cache[require.resolve path.join __dirname, 'commands', name]

    false

  validate: (file) ->
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
        name = file.replace /(.js|.coffee)/, ''
        continue if @disabled.indexOf(name) > - 1 || !@validate(file) || !@indexCommand(name)
        console.log "[.abot8] \x1b[32m\tLoaded \"#{name}\"\x1b[0m"
      true

    undefined

  parse: (message, env) ->
    # Check if message is command
    env = env || 'DISCORD'

    if env == 'DISCORD'
      return undefined if !message.content.startsWith '!'
      content = message.content.split ' '
    else if env == 'CLI'
      content = message.split ' '
    console.log "[.abot8] Command parsed. attempting execution..."

    @run content[0].replace('!', ''), content.dshift(), message, env

    undefined

  find: (command) ->
    # Check if command exists

    for k, _ of global.commands
      if k.toUpperCase() == command.toUpperCase() || global.commands[k].alias.indexOf(command.toLowerCase()) > -1
        return k

    false

  run: (command, args, message, env) ->
    console.log "[.abot8] Attempting to execute #{command}..."
    command = @find command

    return undefined if !command || global.commands[command].environment.indexOf(env) == -1

    global.commands[command].action @client, args, message, env

    console.log "[.abot8] #{command} executed successfully (#{env})"

    undefined

Array.prototype.dshift = () ->
  @shift()
  return @

module.exports = Commands
