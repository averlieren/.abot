module.exports =
  action: (client, args, message, env, connection) ->
    connection.close()
    client.destroy()
    process.exit 1

    true
  alias: []
  description: 'Shuts down the bot'
  environment: ['CLI']
