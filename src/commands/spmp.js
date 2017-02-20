const fs = require('fs');

module.exports = {
  action: (client, args, message)=>{
    audio(message);
  },
  "alias": ['start']
}

function audio(message){
  if(message.guild && message.member.voiceChannel){
    message.member.voiceChannel.join().then(connection => {
      play(connection, message);
    });
  }
}

function play(connection, message){
  if(!connection.speaking){
    fs.readdir('C:/Users/Brandon/Desktop/DHLV2017/', (err, file) => {
      var f = file[Math.floor(Math.random() * file.length)];
      global._current = f.replaceAll('.mp3','').replaceAll('-', ' ');
      const dispatcher = connection.playFile('C:/Users/Brandon/Desktop/DHLV2017/' + f, {volume: 0.2});
      dispatcher.on('end', r =>{
        play(connection, message);
        dispatcher.end('finished');
      });
    });
  }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}
