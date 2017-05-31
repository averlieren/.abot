const UserProfile = require('../user.js');

/*
  Debug command, check games given to user.
*/
module.exports = {
  action: async (client, args, message) => {
    let profile = new UserProfile(message.author);
    let games = await profile.get('games');
    let status = await profile.get('options/tag');
    message.reply(`OPTED IN: ${status.toUpperCase()}\tGAMES: ${games}`);
  },
  'alias': [''],
  'description': 'Debug command, checks data of your user profile.'
}
