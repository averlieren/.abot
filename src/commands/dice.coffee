module.exports =
  action: (client, args, message, env) ->
    if args[0]? && !isNaN args[0]
      message.reply Math.ceil Math.random() * Number(args[0])
    else
      message.reply Math.ceil Math.random() * 6
    true
  alias: ['roll', 'die']
  description: 'Rolls an N sided die, 6 by default'
  environment: ['DISCORD']
