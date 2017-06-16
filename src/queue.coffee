ytdl = require 'ytdl-core'

class Queue
  constructor: (guild) ->
    @guild = guild

  check: (source) ->
    source.includes 'youtube.com/watch?v='

  addToQueue: (source) ->
    return false if !@check source

    g_queue = global.queue[@guild.id]

    if g_queue?
      g_queue.push source
    else
      global.queue[@guild.id] = [source]

    true

  nextInQueue: () ->
    return undefined if !global.queue[@guild.id]

    global.queue[@guild.id].shift()

  play: (client, channel) ->
    return undefined if !channel
    if !global.dispatchers[@guild.id]?
      connection = await channel.join()
      next = @nextInQueue()
      if !next
        connection.disconnect()
        return undefined
      dispatcher = connection.playStream ytdl next, {filter: 'audioonly'}

      dispatcher.on('end', (reason) =>
        global.dispatchers[@guild.id] = null
        @play client, channel
        )

      global.dispatchers[@guild.id] = dispatcher

    undefined



module.exports = Queue
