ytdl = require 'ytdl-core'

class Queue
  constructor: (guild) ->
    @guild = guild

  check: (source) ->
    source.includes 'youtube.com/watch?v='

  getInfo: (source) ->
    return undefined if !check source
    ytdl.getInfo source, (err, info) =>
      return null if err
      return info

    null

  addToQueue: (source) ->
    return undefined if !check source
    global.queue[@guild.id] = [] if !global.queue[@guild.id]

    queue = global.queue[@guild.id]
    info = getInfo source

    return undefined if !info

    queue.push source

    global.queue[@guild.id] = queue;

    @play()

    undefined

  nextInQueue: () ->
    return undefined if !global.queue[@guild.id]

    queue = global.queue[@guild.id]
    next = queue.shift()

    global.queue[@guild.id] = queue

    next

  play: () ->
    next = nextInQueue()
    info = getInfo next

    console.log "[.abot8] #{next}"



module.exports = Queue
