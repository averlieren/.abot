ytdl = require 'ytdl-core'

class Queue
  constructor: (guild) ->
    @guild = guild

  check: (source) ->
    console.log source
    console.log source.includes 'youtube.com/watch?v='
    source.includes 'youtube.com/watch?v='

  addToQueue: (source) ->
    return false if !@check source

    g_queue = global.queue[@guild.id]

    if g_queue?
      g_queue.push source
    else
      global.queue[@guild.id] = [source]

    @play()

    undefined

  nextInQueue: () ->
    return undefined if !global.queue[@guild.id]

    global.queue[@guild.id].shift()

  play: () ->
    next = nextInQueue()
    info = getInfo next

    console.log "[.abot8] #{next}"

    undefined



module.exports = Queue
