const fs = require("node:fs");
const path = require("node:path");

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.commandArray = []

// When a user joins they will be given these two roles
// client.on('guildMemberAdd', (guildMember) => {
//   const onboardingRoleId = guildMember.guild.roles.cache.find(role => role.name === "Onboarding").id
//   const memberRoleId = guildMember.guild.roles.cache.find(role => role.name === "Member").id
//   guildMember.roles.add([onboardingRoleId, memberRoleId])
// });

// client.on('messageCreate', (message) => {
// })

// We do ./src/functions because readdirSync takes an absolute path relative to the Node.js process. The Node.js process would be the server folder.
const functionFolders = fs.readdirSync("./src/discordapp/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/discordapp/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

client.handleCommands();
client.handleEvents();
client.handleComponents();

module.exports = client;