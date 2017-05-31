class Config {
  get(path, file){
    return String(this.raw(path));
  }

  raw(path, file){
    file = file || '../../config/config.json';
    var cfg = require(file);
    var schema = this._path;
    path = path.split('/');

    for(var i = 0; i < path.length; i++){
      var e = path[i];
      if(schema[e]) schema = schema[e];
    }
    return schema;
  }
}

module.exports = Config;
