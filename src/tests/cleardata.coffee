path = require 'path'
Database = new (require path.join __dirname, '../', 'database')

console.log "[.abot8] Clearing database..."

clear = () ->
  Database.connect().then((db) =>
    db.collection('users').deleteMany {}
    db.collection('guilds').deleteMany {}
    db.close()
  )

  undefined

process.exit 1 # Comment in order to clear database

###
  In order to prevent accidental erasure, the following is commented.

  clear().then(() =>
    console.log "[.abot8] Database cleared successfully"
  )
###
