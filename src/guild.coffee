path = require 'path'
Database = new (require path.join __dirname, 'database')

class Guild
  constructor: (guild) ->
    @guild = guild

  retrieve: () ->
    await Database.first 'guilds', {'id': @guild.id}

  check: () ->
    doc = await @retrieve()
    !!doc

  setup: () ->
    return undefined if await @check()
    data = {}

    console.log "[.abot8] Performing first time guild setup for #{@guild.name}"

    data['data'] = {
      'lastSave': ((new Date()).getTime() / 1000).toFixed(0)
    }

    data['queue'] = {}

    data['id'] = @guild.id

    Database.insert 'guilds', data

    undefined

  update: (keys, values) ->
    field = {}
    field[keys[i]] = values[i] for i in [0..keys.length - 1]
    field['data.lastSave']  = ((new Date()).getTime() / 1000).toFixed(0)

    Database.update 'guilds', {'id': @guild.id}, {$set: field}

    undefined

  get: (path) ->
    created = await @check()
    return undefined if !created
    dock = await @retrieve()
    path = path.split '/'
    for i in [0..path.length - 1]
      doc = doc[path[i]] if doc[path[i]]

    doc

module.exports = Guild
