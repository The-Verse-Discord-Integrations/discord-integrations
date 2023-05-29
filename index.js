const config = require('./utils/config.js')
const client = require('./discordbot/discordapp.js')
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Connecting to database
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB:", error.message);
  });


// Connecting Discord Bot
client.login(config.DISC_TOKEN)
