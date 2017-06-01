path = require 'path'
Games = new (require path.join __dirname, '../', 'games')

process.exit 1 if !process.argv[2]

console.log "[.abot8] Game: #{Games.find process.argv[2]}"
