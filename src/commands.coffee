fs     =      require 'fs-extra'
path   =      require 'path'
Config = new (require path.join __dirname, 'config')

class Commands
  constructor: (connection, client) ->
    @client     = client
    @connection = connection

  refresh: () ->
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

    console.log "[.abot8] Found file: #{file} in command folder... invalid format..."

    false

  fetchCommands: () ->
    # Load commands
    console.log "[.abot8] Fetching commands..."
    global.commands = {}
    @disabled = Config.raw 'commands/disabled'
    files = await fs.readdir path.join __dirname, 'commands'

    if @disabled.length != 0
      console.log "[.abot8] The following commands have been disabled; skipping initialization..."
      console.log "[.abot8] \x1b[31m\t#{@disabled.join ', '}\x1b[0m"
      console.log "[.abot8] Loading commands..."

    for file in files
      name = file.replace /(.js|.coffee)/, ''
      continue if @disabled.indexOf(name) > -1 || !@validate(file) || !@indexCommand(name)
      console.log "[.abot8] \x1b[32m\tLoaded \"#{name}\"\x1b[0m"

    undefined

  parse: (message, env) ->
    # Check if message is command
    env = env || 'DISCORD'

    if env == 'DISCORD'
      return undefined if !message.content.startsWith '!'
      content = message.content.split ' '
    else if env == 'CLI'
      content = message.split ' '

    return undefined if !content[0] || content[0] == '!' || content[0].length < 2 # Prevent executing all commands without aliases
    console.log "[.abot8] Received command: \"#{content[0]}\"..."

    @run content[0].replace('!', ''), content.slice(1), message, env

    undefined

  find: (command) ->
    # Check if command exists

    for k, _ of global.commands
      if k.toUpperCase() == command.toUpperCase() || global.commands[k].alias.indexOf(command.toLowerCase()) > -1
        return k

    false

  run: (command, args, message, env) ->
    command = @find command

    return undefined if !command || global.commands[command].environment.indexOf(env) == -1

    global.commands[command].action @client, args, message, env, @connection

    console.log "[.abot8] #{command} (#{env}) executed successfully"

    undefined

module.exports = Commands
