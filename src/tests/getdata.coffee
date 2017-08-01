path     =      require 'path'
Database = new (require path.join __dirname, '../', 'database')

check = (collection) ->
  connection = await Database.getConnection()
  doc        = await Database.find connection, collection, {}
  connection.close()
  console.log "[.abot8] Collection #{collection}, length: #{doc.length}"

  if process.argv[2] && collection == 'users'
    for _, user of doc
      if user.id == process.argv[2] || process.argv[2].toUpperCase() == 'ALL'
        console.log "[.abot8] Data for #{user.data.username}"
        console.log user
        console.log '\n'

  undefined

check 'users'
check 'guilds'
