const Discord = require('discord.js');

/*
  Debug command, test if bot is online and responsive.
*/

function generateHelpPage(page){
  let total = Object.keys(global.commands).length;
  let pages = Math.ceil(total / 5);
  if(page < 1 || page > pages) page = 1;
  let list = [];
  let min = (page - 1) * 5; // 2 - 1 * 5 -> 5
  let max = min + 5;
  for(let i = min; i < max; i++){
    let key = Object.keys(global.commands)[i];
    if(!key) continue;
    let description = global.commands[key].description;
    list.push([key, description]);
  }
  return list;
}

function generateEmbed(page){
  page = Number(page) || 1;
  let helpPage = generateHelpPage(page);
  let desc = '';
  for(let i = 0; i < helpPage.length; i++)
    desc += `**!${helpPage[i][0]}**\n${helpPage[i][1]}\n`
  let embed = new Discord.RichEmbed()
    .setAuthor(`.abot Help (Page ${page} / ${Math.ceil(Object.keys(commands).length / 5)})`, 'https://i.imgur.com/jSW1A45.png')
    .setDescription(desc)
    .setColor('0xff7913')
    .setFooter(`.abot by Brandon Nguyen (a_verlieren#7096)`, 'https://emojipedia-us.s3.amazonaws.com/cache/4a/cf/4acf72ea50fb1361c9748a579ba952fc.png')
    .setTimestamp()
  return embed;
}

module.exports = {
  action: (client, args, message)=>{
    let embed = generateEmbed(args[0]);
    message.channel.send('', {embed});
  },
  'alias': [''],
  'description': 'Returns a list of commands'
}
