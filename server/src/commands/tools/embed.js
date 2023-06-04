const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Creates an embed"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder({
      id: 703906876,
      description:
        "<:notion:1113652415619666003> [NOTION](https://wandering-aftermath-e03.notion.site/The-Verse-Discord-Management-App-b1d5b8d8f3e74217a308312b736f575b)",
      fields: [],
      author: {
        name: "The Verse",
      },
      title: "idk",
    });

    await interaction.deferReply();
    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [embed] });
  },
};
