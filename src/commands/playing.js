module.exports = {
  action: (client, args, message)=>{
    message.reply('Now playing: \"' + global._current + '\"');
  },
  "alias": ['now']
}
