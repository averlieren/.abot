###
  Default structure of a command
###

module.exports =
  action: (client, args, message, env) ->
    msg = 'hello, if you\'re reading this then this command is enabled'
    if env == 'CLI'
      console.log "[.abot8] #{msg}"
    else
      message.reply msg

    undefined
  alias: ['']
  description: ''
  environment: ['DISCORD', 'CLI']
