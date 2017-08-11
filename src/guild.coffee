path     = require 'path'
Database = new (require path.join __dirname, 'database')

class Guild
  constructor: (connection, guild) ->
    @guild      = guild
    @connection = connection

  retrieve: () ->
    # Get guild data from database, if any
    await Database.first @connection, 'guilds', {'id': @guild.id}

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

    Database.insert @connection, 'guilds', data

    undefined

  update: (keys, values) ->
    @modify keys, values, false

    undefined

  unset: (key) ->
    values[i] = '' for i in [0...keys.length]
    @modify keys, values, true

    undefined

  modify: (keys, values, unset) ->
    field = {}

    field[keys[i]] = values[i] for i in [0...keys.length]
    doc = if unset then {$unset: field} else {$set: field}

    Database.update @connection, 'users', {'id': @user.id}, doc

    @updateLastSaved()

    undefined

  updateLastModified: () ->
    @modify(['data.lastSave'], [String Date.now()])

    undefined


  get: (location) ->
    # Get guild data from path
    if await @check()
      doc      = await @retrieve()
      location = location.split '/'

      for i in location
        if doc[i]
          doc = doc[i]
      
      return doc
    else
      return undefined


module.exports = Guild
