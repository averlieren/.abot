var Winston     = require('winston');
var Config      = require('./config.js');
var path        = require('path');

var conf        = new Config();
var date        = new Date();
var formatted   = date.toLocaleString('en-us', {day: '2-digit'}) + date.toLocaleString('en-us', {month: 'short'}).toUpperCase() + date.getFullYear() + " - " + date.getTime();
var logger      = new (Winston.Logger)({
    transports: [
      new (Winston.transports.Console)({}),
      new (Winston.transports.File)({filename: conf.get('directories/defaultDir') + path.sep + conf.get('directories/logDir') + path.sep + formatted + '.log'})
    ]
  });

function Logger(){

}

Logger.prototype.log = function(prefix, msg){
  logger.log('info', prefix + ' ' + msg);
}

module.exports = Logger;
