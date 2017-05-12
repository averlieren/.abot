const UserProfile = require('../user.js');

/*
  Allows user to opt-in to game tagging, should probably do an opt-out... TODO!
*/
module.exports = {
  action: async (client, args, message) => {
    let profile = new UserProfile(message.author);
    profile.update(
      ['options.tag'],
      ['false']
    );
    message.reply('You have sucessfully opted in for receiving game tags.');
  },
  "alias": ['']
}
