path = require 'path'
Database = new (require path.join __dirname, 'database')

class Guild
  constructor: (guild) ->
    @guild = guild

  retrieve: () ->
    # Get guild data from database, if any
    await Database.first 'guilds', {'id': @guild.id}

  check: () ->
    # If no guild data is found, return false
    (await @retrieve())?

  setup: () ->
    # If check fails, input guild data to database
    return undefined if await @check()
    data = {}

    console.log "[.abot8] Performing first time guild setup for #{@guild.name}"

    data['data'] = {
      'lastSave': ((new Date()).getTime() / 1000).toFixed(0)
    }

    data['id'] = @guild.id

    Database.insert 'guilds', data

    undefined

  update: (keys, values) ->
    # Update guild data
    field = {}
    field[keys[i]] = values[i] for i in [0...keys.length]
    field['data.lastSave']  = ((new Date()).getTime() / 1000).toFixed(0)

    Database.update 'guilds', {'id': @guild.id}, {$set: field}

    undefined

  get: (location) ->
    # Get guild data from path
    created = await @check()
    return undefined if !created
    dock = await @retrieve()
    location = location.split '/'
    for i in location
      doc = doc[i] if doc[i]

    doc

module.exports = Guild
