/*
  TODO: Replace lengthy promise chains with async/await.
  NOTE: forEach loops are generally slower then for loops in Chromium based browsers and engines,
    this is particularily true for larger lists. The performance difference of small lists is
    within a margin of error.
*/
require('coffeescript/register')

const Discord = require('discord.js');

const UserProfile = require('./user');
const Config = require('./config');
const Tags = new (require('./tagging'));
const Guild = require('./guild');

const Database = new (require('./database'))();
const Client = new Discord.Client();
const Commands = new (require('./commands'))(Client);
const Games = new (require('./games'))();

async function profileSetup(){
  /*
    Setup new user profiles if not exist
  */
  var users = [];
  Client.guilds.forEach((guild) => {
    if(guild.available){
      guild.members.forEach((guildMember) => {
        if(users.indexOf(guildMember.user) == -1 && !guildMember.user.bot) users.push(guildMember.user);
      });
      new Guild(guild).setup();
    }
  });

  for(var i = 0; i < users.length; i++) (new UserProfile(users[i])).setup();
  return true;
}

Client.on('ready', async () => {
  console.log('[.abot8] Logged in... checking database status...');
  Database.connect().then((db) => {
    /*
      Attempt to establish connection to database, if failure then exit.
      In here, database is confirmed to be online, execute actions that depend on
        database connectivity here.
    */
    console.log("[.abot8] Database 'abot' online");
    db.close();
    profileSetup().then(() => {
      /*
        User profiles finished setup, execute other actions that depend on user profiles here.
      */
      console.log("[.abot8] Fetching commands...");
      Commands.fetchCommands();
      console.log("[.abot8] Startup successful, bot is online.");
      global.client = Client;
      global.queue = {};
    });
  })
});

Client.on('presenceUpdate', (_, member) => {
  /*
    QUESTION: Should I have a check for valid games
  */
  console.log(`[.abot8] Presence Update for ${member.user.username}`);
  if(member.presence.game) Games.addToGame(member);
})

Client.on('disconnect', () => {
  console.log("[.abot8] Lost connection to Discord servers... attempting to reestablish connection...");
})

Client.on('message', (message) => {
  /*
    Attempt to handle tagging and commands.
    To prevent feedback loop, ignore all bot message.
    Only accept messages from guilds.
  */
  console.log(`[.abot8] MESSAGE [${new Date().toUTCString()}] (ID: ${message.author.id}) ${(message.author.bot ? 'BOT' : 'USER')} ${message.author.username}: ${message.content}`);

  if(message.author.bot || !message.guild) return;
  Commands.parse(message);
  Tags.parse(message);
})

Client.on('guildMemberAdd', (member) => {
  /*
    Setup new userprofile if not exists for new user, to ensure dependent functions work properly
  */
  console.log("[.abot8] guildMemberAdd event");
  (new UserProfile(member.user)).setup();
})

Client.login('login token here');

console.log('[.abot8] Logging in and initializing...');
