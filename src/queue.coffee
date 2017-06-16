path = require 'path'
ytdl = require 'ytdl-core'
Embeds = new (require path.join __dirname, 'embeds')

class Queue
  constructor: (guild) ->
    @guild = guild

  check: (source) ->
    source.includes 'youtube.com/watch?v='

  addToQueue: (source) ->
    return false if !@check source

    if global.queue[@guild.id]?
      global.queue[@guild.id].push source
    else
      global.queue[@guild.id] = [source]

    true

  nextInQueue: () ->
    return undefined if !global.queue[@guild.id]

    global.queue[@guild.id].shift()

  isPlaying: () ->
    global.playing[@guild.id]?

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

  getPlaying: (embed) ->
    if embed
      Embeds.generate(".abot", "**Playing: [#{global.playing[@guild.id][0]}](#{global.playing[@guild.id][1]})**")
    else
      global.playing[@guild.id]

  getQueue: () ->
      global.queue[@guild.id]

  play: (client, channel) ->
    return null if !channel
    if !global.dispatchers[@guild.id]?
      connection = await channel.join()
      next = @nextInQueue()

      if !next
        connection.end()
        return false

      dispatcher = connection.playStream ytdl next, {filter: 'audioonly'}

      info = await ytdl.getInfo next
      global.playing[@guild.id] = [info.title, info.video_url]

      dispatcher.on('end', (reason) =>
        global.dispatchers[@guild.id] = null
        @play client, channel
        )

      global.dispatchers[@guild.id] = dispatcher

      return true

    false



module.exports = Queue
