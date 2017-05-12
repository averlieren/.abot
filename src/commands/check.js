const UserProfile = require('../user.js');

/*
  Debug command, check games given to user.
*/
module.exports = {
  action: async (client, args, message) => {
    let item = args[0] || 'games';
    let profile = new UserProfile(message.author);
    let data = await profile.get(item);
    message.reply(data);
  },
  "alias": ['']
}
