const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactor")
    .setDescription("reacturns reactions"),
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: "react here",
      fetchReply: true,
    });

    const emoji = client.emojis.cache.find(emoji => emoji.id == '1113652415619666003')
    
    message.react(emoji);

    const filter = (reaction, user) => {
      return reaction.emoji.name == emoji && user.id == interaction.user.id;
    };

    const collector = message.createReactionCollector({ filter, time: 15000 });

    collector.on("collect", (reaction, user) => {
      console.log("collected", reaction.emoji.name);
    });

    collector.on("end", (collected) => {
      console.log(collected.size);
    });
  },
};
