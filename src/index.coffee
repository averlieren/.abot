path      = require 'path'
Discord   = require 'discord.js'

Client    = new Discord.Client()
Commands  =      require path.join __dirname, 'commands'
Config    = new (require path.join __dirname, 'config'  )()
Database  = new (require path.join __dirname, 'database')()
Games     =      require path.join __dirname, 'games'
Guild     =      require path.join __dirname, 'guild'
Input     =      require path.join __dirname, 'input'
Tags      =      require path.join __dirname, 'tags'
User      =      require path.join __dirname, 'user'

profileSetup = (connection) =>
  await undefined
  users = []

  for [_, guild] from Client.guilds
    for [_, member] from guild.members
      users.push member.user if !member.user.bot && users.indexOf(member.user) ==  -1

    new Guild(connection, guild).setup()
  new User(connection, user).setup() for user in users

  true

Client.on 'ready', () =>
  console.log "[.abot8] Sucessfully logged in"

  connection = await Database.getConnection()
  Tags       = new Tags     connection
  Games      = new Games    connection
  Input      = new Input    connection, Client
  Commands   = new Commands connection, Client

  profileSetup(connection).then((_) =>
    Commands.fetchCommands()
    Input.listen()

    global.queue = {}
    global.dispatchers = {}
    global.playing = {}

    console.log "[.abot8] \x1b[32m.abot is now online\x1b[0m"
    )

  undefined

Client.on 'message', (message) =>
  return undefined if message.author.bot || !message.guild

  Commands.parse message
  Tags.parse message

  undefined

Client.on 'presenceUpdate', (_, member) =>
  if(member.presence.game && !member.user.bot)
    console.log "[.abot8] Presence update for #{member.user.username} (#{member.presence.game.name})"
    Games.addToGame member

  undefined

Client.on 'guildMemberAdd', (member) =>
  console.log "[.abot8] New member, \"#{member.user.username}\""
  new User(member.user, connection).setup()

  undefined

Client.on 'disconnect', () =>
  console.log "[.abot8] Lost connection... reestablishing connection."
  return undefined

Client.login Config.get 'core/token'

console.log "[.abot8] Logging in and initializing..."
