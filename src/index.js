require('coffeescript/register')

const path = require('path');
const Discord = require('discord.js');

const Client = new Discord.Client();
const Commands = new (require(path.join(__dirname, 'commands')))(Client);
const Config = new (require(path.join(__dirname, 'config')));
const Database = new (require(path.join(__dirname, 'database')))();
const Games = new (require(path.join(__dirname, 'games')))();
const Guild = require(path.join(__dirname, 'guild'));
const Tags = new (require(path.join(__dirname, 'tagging')));
const UserProfile = require(path.join(__dirname, 'user'));
const Input = new (require(path.join(__dirname, 'input')))(Client);
process.stdin.setEncoding('utf8')

async function profileSetup(){
  // Setup new user profiles if not exist
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

  Database.getConnection().then((connection) => {
    // Exit if failure to connect to database
    console.log(`[.abot8] Database '${Config.get('core/database/name')}' online`);
    connection.close();
    profileSetup().then(async () => {
      Commands.fetchCommands();
      console.log("[.abot8] Startup successful, bot is online.");
      Input.listen();

      global.client = Client;
      global.queue = {};
    });
  })
});

Client.on('presenceUpdate', (_, member) => {
  if(member.presence.game){
    console.log(`[.abot8] Presence update for ${member.user.username} (${member.presence.game.name})`);
    Games.addToGame(member);
  }
})

Client.on('disconnect', () => {
  console.log("[.abot8] Lost connection to Discord servers... attempting to reestablish connection...");
})

Client.on('message', (message) => {
  // Handle tagging and commands; prevent feedback loop by excluding bot and non-guild messages.

  console.log(`[.abot8] MESSAGE [${new Date().toUTCString()}] (ID: ${message.author.id}) ${(message.author.bot ? 'BOT' : 'USER')} ${message.author.username}: ${message.content}`);

  if(message.author.bot || !message.guild) return;
  Commands.parse(message);
  Tags.parse(message);
})

Client.on('guildMemberAdd', (member) => {
  // Setup new user profile if not exists for new user, to ensure dependent functions work properly
  console.log(`[.abot8] guildMemberAdd event: ${member.user.username}`);
  (new UserProfile(member.user)).setup();
})

Client.login(Config.get('core/token'));

console.log('[.abot8] Logging in and initializing...');
