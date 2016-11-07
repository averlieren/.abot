cfgFile = require './config/config.json'

module.exports =
  get: (item) -> String @raw item
  raw: (item) -> @retrieve item, cfgFile
  retrieve: (item, file) ->
    path = item.split '/'
    origin = file
    result = null

    path.forEach (e) ->
      result = result[e] if result? && result[e]?
      result = origin[e] if !result? && origin[e]?
    result
