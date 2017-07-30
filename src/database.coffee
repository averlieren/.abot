path        =      require 'path'
MongoClient =      require('mongodb').MongoClient
Config      = new (require path.join __dirname, 'config')
URL         = "mongodb://#{Config.get 'core/database/ip'}:#{Config.get 'core/database/port'}/#{Config.get 'core/database/name'}"

class Database
  getConnection: () ->
    await MongoClient.connect URL

  find: (connection, collection, query) ->
    cursor = connection.collection(collection).find query
    doc = await cursor.toArray()

    doc

  first: (connection, collection, query) ->
    doc = await @find connection, collection, query

    doc[0]

  insert: (connection, collection, doc) ->
    connection.collection(collection).insertOne doc

    undefined

  update: (connection, collection, filter, fields) ->
    connection.collection(collection).updateOne filter, fields

    undefined

  save: (connection, collection, filter, doc) ->
    connection.collection(collection).replaceOne filter, doc

    undefined

module.exports = Database
