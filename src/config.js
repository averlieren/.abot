const cfg = require('./config/config.json');

class Config {
  get(path){
    return String(this.raw(path));
  }

  raw(path){
  path = path.split('/');
  var result = undefined;

  path.forEach(e =>{
    if(result && result[e]) result = result[e];
    if(!result && cfg[e]) result = cfg[e];
  });

  return result;
  }
}

module.exports = Config;
