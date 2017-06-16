path = require 'path'
Discord = require 'discord.js'

Client = new Discord.Client()
Commands = new (require path.join __dirname, 'commands')(Client)
Config = new (require path.join __dirname, 'config')()
Database = new (require path.join __dirname, 'database')()
Games = new (require path.join __dirname, 'games')()
Guild = require path.join __dirname, 'guild'
Input = new (require path.join __dirname, 'input')(Client)
Tags = new (require path.join __dirname, 'tags')()
UserProfile = require path.join __dirname, 'user'

checkConnection = () ->
  connection = await Database.getConnection()

  if connection
    console.log "[.abot8] Database \"#{Config.get 'core/database/name'}\" online"
    connection.close()
  else
    console.log "[.abot8] Database \"#{Config.get 'core/database/name'}\" offline"
    process.exit 1

  true

profileSetup = () ->
  # Also want method to explicitly define async functions
  UserList = await Database.find 'users', {}
  GuildList = await Database.find 'guilds', {}
  IDList =
    guilds: []
    users: []
  users = []

  IDList.users.push user.id for user in UserList
  IDList.guilds.push guild.id for guild in GuildList

  for [_, guild] from Client.guilds
    for [_, member] from guild.members
      users.push member.user if !user.id in IDList.users && !member.user.bot && !member.user in users
    new Guild(guild).setup() if !guild.id in IDList.guilds

  new UserProfile(user).setup() for user in users

  true

Client.on 'ready', () =>
  console.log "[.abot8] Logged in... checking database..."

  checkConnection().then((_) =>
    profileSetup().then((_) =>
      Commands.fetchCommands()
      Input.listen()

      console.log "[.abot8] Startup successful, bot is now online"

      global.queue = {}
      global.dispatchers = {}
      global.playing = {}
    )
  )

Client.on 'message', (message) =>
  console.log "[.abot8] MESSAGE [#{new Date().toUTCString()}] (ID: #{message.author.id}) (#{if message.author.bot then 'BOT' else 'USER'}) #{message.author.username}: #{message.content}"

  return undefined if message.author.bot || !message.guild

  Commands.parse message
  Tags.parse message

Client.on 'presenceUpdate', (_, member) =>
  if(member.presence.game)
    console.log "[.abot8] Presence update for #{member.user.username} (#{member.presence.game.name})"
    Games.addToGame member

Client.on 'guildMemberAdd', (member) =>
  console.log "[.abot8] New member, \"#{member.user.username}\""

Client.on 'disconnect', () =>
  console.log "[.abot8] Lost connection... attempting to reestablish a connection..."

Client.login Config.get 'core/token'

console.log "[.abot8] Logging in and initializing..."
