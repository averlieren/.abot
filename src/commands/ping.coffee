###
  Debug command, returns with 'pong' if bot is online and responsive
###

module.exports =
  action: (client, args, message, env, connection) ->
    if env == 'CLI'
      console.log "[.abot8] pong"
    else
      message.reply 'pong'

    true
  alias: []
  description: 'Checks if the bot is responsive'
  environment: ['DISCORD', 'CLI']
