###
  Default structure of a command
###

module.exports =
  action: (client, args, message) ->
    message.reply 'hello, if you\'re reading this then this command is enabled'
    undefined
  alias: ['']
  description: ''
