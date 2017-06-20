path = require 'path'
ytdl = require 'ytdl-core'
Embeds = new (require path.join __dirname, 'embeds')

class Queue
  constructor: (guild) ->
    @guild = guild

  getQueue: () ->
      global.queue[@guild.id]

  check: (source) ->
    source.includes('youtube.com/watch?v=') || source.includes('youtu.be')

  getInfo: (url) ->
    await ytdl.getInfo url

  isPlaying: () ->
    global.playing[@guild.id]?

  getPlaying: (embed) ->
    if embed
      Embeds.generate(".abot", "**Playing: [#{global.playing[@guild.id][1]}](#{global.playing[@guild.id][0]})**")
    else
      global.playing[@guild.id]

  getDispatcher: () ->
    global.dispatchers[@guild.id]

  addToQueue: (source) ->
    return false if !@check source
    info = await @getInfo source
    global.queue[@guild.id] = [] if !global.queue[@guild.id]?

    global.queue[@guild.id].push [info.video_url, info.title]

    true

  nextInQueue: () ->
    return undefined if !global.queue[@guild.id]

    global.queue[@guild.id].shift()

  play: (client, channel) ->
    return null if !channel
    if !global.dispatchers[@guild.id]?
      connection = await channel.join()
      next = @nextInQueue()

      if !next
        connection.disconnect()
        return false

      dispatcher = connection.playStream ytdl next[0], {filter: 'audioonly'}

      global.playing[@guild.id] = next

      dispatcher.on('end', (reason) =>
        global.dispatchers[@guild.id] = null
        @play client, channel
        )

      global.dispatchers[@guild.id] = dispatcher

      return true

    false

  skip: () ->
    # Stops current track, will continue to next track if there's one
    if @isPlaying()
      global.dispatchers[@guild.id].end()

    undefined

  end: () ->
    # Stops current track and deletes queue
    @skip()
    global.queue[@guild.id] = null
    global.dispatchers[@guild.id] = null
    global.playing[@guild.id] = null

    undefined

module.exports = Queue
