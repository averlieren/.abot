//Import
const Discord = require('discord.js');
const fs = require('fs');
const Package = require('../package.json');
const CommandManager = require('./commands.js');

//Instantiate
const bot = new Discord.Client();
const cm = new CommandManager(bot);

bot.on('ready', ()=>{
  console.log('.abot' + Package.version + ' has launched successfully.');
});

bot.on('message', message=>{
  cm.parse(message);
});

bot.login('');
