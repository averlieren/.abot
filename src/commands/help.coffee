###
  Replies with an embed containing a list of 5 commands per page along
    with the description of the command's purpose.
###

path = require 'path'
Discord = require 'discord.js'
Embeds = new (require path.join __dirname, '../', 'embeds')

getHelpPage = (page) ->
  total = Object.keys(global.commands).length
  pages = Math.ceil total / 5
  list = []

  page = 1 if page < 1 || page > pages

  min = (page - 1) * 5
  max = min + 5

  for i in [min...max]
    key = Object.keys(global.commands)[i]
    continue if !key
    description = global.commands[key].description
    list.push [key, description]

  [list, page]

getPage = (page, env) ->
  page = Number page || 1
  help = getHelpPage page
  title = "Help (Page #{help[1]} / #{Math.ceil Object.keys(commands).length / 5})"
  desc = ''

  if env = "CLI"
    console.log "[.abot8] #{title}"
    console.log "[.abot8] #{command[0]}: #{command[1]}" for command in help[0]

    undefined
  else
    desc += "**!#{command[0]}**\n#{command[1]}\n" for command in help[0]

    Embeds.generate ".abot #{title}", desc

module.exports =
  action: (client, args, message, env) ->
    if env == 'CLI'
      getPage args[0], env
    else
      message.channel.send '', getPage args[0], env

    undefined
  alias: ['']
  description: 'Returns a list of commands'
  environment: ['DISCORD', 'CLI']
