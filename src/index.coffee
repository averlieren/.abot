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
  await undefined
  users = []
  for [_, guild] from Client.guilds
    for [_, member] from guild.members
      users.push member.user if !member.user.bot && !member.user in users

    new Guild(guild).setup()
  new UserProfile(user).setup() for user in users

  true

Client.on 'ready', () =>
  console.log "[.abot8] Logged in... checking database..."
  console.time '[.abot8] Startup successful in'
  checkConnection().then((_) =>
    profileSetup().then((_) =>
      Commands.fetchCommands()
      Input.listen()

      global.queue = {}
      global.dispatchers = {}
      global.playing = {}

      console.timeEnd '[.abot8] Startup successful in'
      console.log "[.abot8] \x1b[32m.abot is now online\x1b[0m"
    )
  )

Client.on 'message', (message) =>
  console.log "[.abot8] MESSAGE [#{new Date().toUTCString()}] (ID: #{message.author.id}) (#{if message.author.bot then 'BOT' else 'USER'}) #{message.author.username}: #{message.content}"

  return undefined if message.author.bot || !message.guild

  Commands.parse message
  Tags.parse message

Client.on 'presenceUpdate', (_, member) =>
  if(member.presence.game && !member.user.bot)
    console.log "[.abot8] Presence update for #{member.user.username} (#{member.presence.game.name})"
    Games.addToGame member

Client.on 'guildMemberAdd', (member) =>
  console.log "[.abot8] New member, \"#{member.user.username}\""
  new UserProfile(member.user).setup()

Client.on 'disconnect', () =>
  console.log "[.abot8] Lost connection... attempting to reestablish a connection..."

Client.login Config.get 'core/token'

console.log "[.abot8] Logging in and initializing..."
