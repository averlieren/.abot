###
  Debug command, returns with 'pong' if bot is online and responsive
###

module.exports =
  action: (client, args, message) ->
    message.reply 'pong'

    undefined
  alias: ['']
  description: 'Checks if the bot is on'
