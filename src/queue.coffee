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

  play: (channel) ->
    return undefined if !channel
    if !global.dispatchers[@guild]?
      next = @nextInQueue()

      return undefined if !next

      connection = await channel.join()
      dispatcher = connection.playStream ytdl next, {filter: 'audioonly'}

      dispatcher.on('end', (reason) =>
        delete global.dispatchers[@guild]
        @play channel
        )

      global.dispatchers[@guild] = dispatcher

    undefined



module.exports = Queue
