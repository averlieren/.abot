Discord = require 'discord.js'

class Embeds
  generate: (title, message, color) ->
    color = color || '0xff7913';
    new Discord.RichEmbed()
      .setAuthor title, 'https://i.imgur.com/jSW1A45.png'
      .setDescription message
      .setColor color
      .setFooter '.abot by Brandon Nguyen (a_verlieren#7096)', 'https://emojipedia-us.s3.amazonaws.com/cache/4a/cf/4acf72ea50fb1361c9748a579ba952fc.png'
      .setTimestamp()

module.exports = Embeds
