path = require 'path'

class Config
  get: (path, file) ->
    # Returns a string of requested path from file
    String @raw path, file

  raw: (path, file) ->
    file = file || path.join __dirname, 'config/config.json'
    file = require file
    schema = path
    path = path.split '/'
    for i in path
      schema = schema[i] if schema[i]
    schema

module.exports = Config
