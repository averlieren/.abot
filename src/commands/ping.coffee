###
  Debug command, returns with 'pong' if bot is online and responsive
###

module.exports =
  action: (client, args, message, env) ->
    if env == 'CLI'
      console.log "[.abot8] pong"
    else
      message.reply 'pong'

    undefined
  alias: ['']
  description: 'Checks if the bot is on'
  environment: ['DISCORD', 'CLI']
