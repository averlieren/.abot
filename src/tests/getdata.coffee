path = require 'path'
Database = new (require path.join __dirname, '../', 'database')

check = (collection) ->
  doc = await Database.find collection, {}
  console.log "[.abot8] Collection #{collection}, length: #{doc.length}"
  
  if process.argv[2] && collection == 'users'
    for _, user of doc
      if user.id == process.argv[2] || process.argv[2].toUpperCase() == 'ALL'
        console.log "[.abot8] Data for #{user.data.username}: #{user.games} (#{user.options.tag.toUpperCase()}) [#{user.data.lastSave}]"

  undefined

check 'users'
check 'guilds'
