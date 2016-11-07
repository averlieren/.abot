const Commands  = require('../commands.js');
const Vacations = require('../config/breaks.json');

module.exports = {
  "action": function(bot, message, args){
    var type  = true;
    var time  = undefined;
    var name  = undefined;
    var msg   = " day(s) until ";
    var dur   = undefined;

    for(var k in Vacations){
      var now   = new Date().getTime();
      var start = new Date(Vacations[k].start).getTime();
      var end   = new Date(Vacations[k].end).getTime() + 86399000;
      var until = Math.round((start - now) / 1000 / 60 / 60 / 24, 0);
      if(now > end) continue;
      if(now > start) until = Math.round((end - now) / 1000 / 60 / 60 / 24, 0);

      if(time == undefined || until < time){
        time = until;
        name = k;
        dur = Vacations[k].duration;
        if(now > start) type = false;
      }
    }
    if(!type) msg = " day(s) left for ";
    Commands.reply(bot, message, time + msg + name + " (lasts " + dur + " days)");
  },
  "description": "When is the next break?",
  "permission": "commands.break",
  "alias": [
    "VAC"
  ]
}
