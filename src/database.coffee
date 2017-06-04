path = require 'path'
MongoClient = require('mongodb').MongoClient
Config = new (require path.join __dirname, 'config')
URL = "mongodb://#{Config.get 'core/database/ip'}:#{Config.get 'core/database/port'}/#{Config.get 'core/database/name'}"

class Database
  getConnection: () ->
    await MongoClient.connect URL

  find: (collection, query) ->
    connection = await @getConnection()
    cursor = connection.collection(collection).find query
    doc = await cursor.toArray()
    connection.close()

    doc

  first: (collection, query) ->
    doc = await @find collection, query

    doc[0]

  insert: (collection, doc) ->
    connection = await @getConnection()
    connection.collection(collection).insertOne doc
    connection.close()

    undefined

  update: (collection, filter, fields) ->
    connection = await @getConnection()
    connection.collection(collection).updateOne filter, fields
    connection.close()

    undefined

  save: (collection, filter, doc) ->
    connection = await @getConnection()
    connection.collection(collection).replaceOne filter, doc
    connection.close()

    undefined

module.exports = Database
