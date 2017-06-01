path = require 'path'
Database = new (require path.join __dirname, 'database')

###
  MongoDB Document Structure:

  id
  data
    accountCreated
    discriminator
    username
  permissions
    server
      server1
        group
          permissions [node1, node2, ..., nodeN]
      server2
        group
          permissions [node1, node2, ..., nodeN]
      ...
      serverN
        group
          permissions [node1, node2, ..., nodeN]
    global
      group
      permissions [node1, node2, ..., nodeN]
  options
    tag
    muted
    queue
  games [game1, game2, ..., gameN]
###


class User
  constructor: (user) ->
    @user = user
  retrieve: () ->
    # Attempt to retrieve user data from 'users' collection.
    await Database.first 'users', {'id': @user.id}
  check: () ->
    # Checks if user data is present and user is not bot.
    doc = await @retrieve()
    if doc == null && !@user.bot
      false
    else
      true
  setup: () ->
    # Do if check fails.
    return undefined if await @check()
    data = {}

    console.log "[.abot8] Performing first time setup for #{@user.username}."

    data['id'] = @user.id

    data['data'] = {
      'lastSave': ((new Date()).getTime() / 1000).toFixed(0),
      'accountCreated': ((@user.id / 4194304) + 1420070400000).toFixed(0),
      'discriminator': @user.discriminator,
      'username': @user.username
    }

    data['options'] = {
      'tag': 'false',
      'muted': '-1',
      'queue': 'true'
    }

    data['permissions'] = {
      'server': {},
      'global': {
        'group': 'default',
        'permissions': []
      }
    }

    data['games'] = []

    Database.insert 'users', data

    undefined

  update: (keys, values) ->
    field = {}
    field[keys[i]] = values[i] for i in [0..keys.length - 1]
    field['data.lastSave'] = ((new Date()).getTime() / 1000).toFixed(0)

    Database.update 'users', {'id': @user.id}, {$set: field}

    undefined

  get: (path) ->
    # Retrieve user data and find data at given path, delimiter '/'
    # QUESTION: Change delimiter to '.' to maintain consistency with MongoDB
    created = await @check()
    return undefined if !created
    doc = await @retrieve()
    path = path.split '/'
    for i in [0..path.length - 1]
      doc = doc[path[i]] if doc[path[i]]

    doc

module.exports = User
