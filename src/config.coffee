path = require 'path'

class Config
  get: (location, file) ->
    # Returns a string of requested location from file
    String @raw location, file

  raw: (location, file) ->
    file = require(file || path.join __dirname, 'config', 'settings.json')
    schema = file
    location = location.split '/'

    for i in location
      schema = schema[i] if schema[i]
    schema

  refresh: (file) ->
    file = file || path.join __dirname, 'config', 'settings.json'
    console.log "[.abot8] Unloading #{file}"
    delete require.cache[require.resolve file]

    undefined

module.exports = Config
