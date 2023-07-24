const { Client } = require('discord.js');
const messageCreateHandler = require('./message');

const client = new Client();


//client.addEventListener()

client.on('messageCreate', async (message) => {
    try {
      // Call the messageCreateHandler.execute() function passing the 'message' and 'client' objects
      await messageCreateHandler.execute(message, client);
    } catch (error) {
      console.error('Error in messageCreateHandler:', error);
    }
  });
  