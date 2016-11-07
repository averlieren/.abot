const Commands = require('../commands.js');
const Data     = require('../data.js');

function toggle(user){
	var option = Data.get(user, 'tagging');
	if(option == null || option == true){
		Data.set(user, {'tagging': false});
		return 'You have opted out of role tagging.';
	} else {
		Data.set(user, {'tagging': true});
		return 'You have opted into role tagging.'
	}
}

module.exports = {
	"action": function(bot, message, args){
		var user = message.sender.id;
		Commands.reply(bot, message, toggle(user), 25000);
	},
	"description": "Opt in/out from tagging",
	"permission": "commands.toggle",
	"alias":[
		"stfu"
	]
}
