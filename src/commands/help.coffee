###
  Replys with an embed containing a list of 5 commands per page along
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

  for i in [min..max - 1]
    key = Object.keys(global.commands)[i]
    continue if !key
    description = global.commands[key].description
    list.push [key, description]

  list

getEmbed = (page) ->
  page = Number page || 1
  helpPage = getHelpPage page
  desc = ''
  desc += "**!#{helpPage[i][0]}**\n#{helpPage[i][1]}\n" for i in [0..helpPage.length - 1]

  Embeds.generate ".abot Help (Page #{page} / #{Math.ceil Object.keys(commands).length / 5})", desc


module.exports =
  action: (client, args, message) ->
    message.channel.send '', getEmbed args[0]

    undefined
  alias: ['']
  description: 'Returns a list of commands'
