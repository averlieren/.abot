var config      = require('./config/config.json');

function Config(){

}

Config.prototype.get = function(item){
  return String(this.raw(item));
}

Config.prototype.raw = function(item){
  var split = item.split('/');
  var conf  = config;
  split.forEach(function(e){
    if(typeof conf[e] != 'undefined'){
      conf = conf[e];
    }
  });
  return conf;
}

module.exports = Config;
