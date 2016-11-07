require('coffee-script').register();
const Winston = require('winston');
const Config  = require('./config.coffee');
const date    = new Date();

const Logger  = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)({}),
    new (Winston.transports.File)({filename: Config.get('directories/logs') + '/' + date.getTime() + '.log'})
  ]
});

module.exports = Logger;
