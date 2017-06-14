module.exports =
  action: (client, args, message, env) ->
    list = message.content.substring(8).split ','
    message.reply list[Math.floor(Math.random() * list.length)]
    
    true
  alias: []
  description: 'Randomly chooses from a list, options separated by a comma'
  environment: ['DISCORD']
