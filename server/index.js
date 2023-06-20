const { DISC_TOKEN, MONGODB_URI, PORT } = require("./utils/config.js");
const app = require("./src/API/app.js");
const client = require("./src/discordapp/discordapp.js");
const mongoose = require("mongoose");

const port = PORT || "8080";

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

app.listen(port, () => {
  console.log("Sever live on PORT ", port);
});

// Connecting Discord Bot
client.login(DISC_TOKEN);
