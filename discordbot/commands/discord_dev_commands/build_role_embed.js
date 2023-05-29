const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const client = require("../../discordapp");
const { Channel } = require("diagnostics_channel");

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Some title")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Some name",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("Some description here")
  .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    { name: "\u200B", value: "\u200B" },
    { name: "Inline field title", value: "Some value here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("build_role_selector")
    .setDescription("Creates and sends the embed for the role selector"),

  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();
    // interaction.channel.send({ embeds: [exampleEmbed] })
    const collectorFilter = (m) => {
        console.log(m.content)
      m.content.includes("discord");
    };
    const collector = interaction.channel.createMessageCollector({
      filter: collectorFilter,
      time: 15000,
      maxProcessed: 9999
    });

    collector.on("collect", (m) => {
      console.log(`Collected ${m.content}`);
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
    });
  },
};
