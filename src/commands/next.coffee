path = require 'path'
Queue = require path.join __dirname, '../', 'queue'
Embeds = new (require path.join __dirname, '../', 'embeds')

module.exports =
  action: (client, args, message, env) ->
    queue = new Queue message.guild
    if queue.getQueue? && queue.getQueue()[0]
      info = queue.getQueue()[0]
      message.channel.send '', Embeds.generate '.abot', "**Next: [#{info[1]}](#{info[0]})**"
    else
      message.reply 'Nothing is scheduled'
    true
  alias: []
  description: 'Check what\'s next'
  environment: ['DISCORD']
