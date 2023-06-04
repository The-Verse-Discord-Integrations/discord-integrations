const { DISC_TOKEN, MONGODB_URI } = require("./utils/config.js");
const client = require("./src/discordapp.js");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Connecting to database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB:", error.message);
  });

// Connecting Discord Bot
client.login(DISC_TOKEN);
