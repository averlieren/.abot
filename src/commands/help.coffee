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
  page = 1 if isNaN page
  page = Number page|| 1
  help = getHelpPage page
  title = "Help (Page #{help[1]} / #{Math.ceil Object.keys(commands).length / 5})"
  desc = ''

  if env == "CLI"
    console.log "[.abot8] #{title}"
    console.log "[.abot8] #{command[0]}: #{command[1]}" for command in help[0]

    false
  else
    desc += "**!#{command[0]}**\n#{command[1]}\n" for command in help[0]

    Embeds.generate ".abot #{title}", desc

module.exports =
  action: (client, args, message, env) ->
    page = getPage args[0], env
    message.channel.send '', page, env if page

    true
  alias: []
  description: 'Lists out all commands with their descriptions'
  environment: ['DISCORD', 'CLI']
