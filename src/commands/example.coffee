###
  Default structure of a command
###

module.exports =
  action: (client, args, message, env) ->
    # Define what the command will do
    msg = 'hello, if you\'re reading this then this command is enabled'
    if env == 'CLI'
      # Change behavior if command is executed in CLI
      console.log "[.abot8] #{msg}"
    else if env == 'DISCORD'
      # Behavior if command is executed in Discord
      message.reply msg

    true # Return true if command has executed properly
  alias: []                       # Alias(es) for the command; use empty array if none
  description: ''                 # Description of what command does; must be non empty string
  environment: ['DISCORD', 'CLI'] # Determines what environment the command can ran in
