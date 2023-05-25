const config = require('./utils/config.js')
const client = require('./discordbot/discordapp.js')

client.login(config.DISC_TOKEN)
