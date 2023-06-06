const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Creates an embed"),
  async execute(interaction, client) {
    await interaction.deferReply();

    // Creating the embed
    const embed = new EmbedBuilder({
      id: 703906876,
      title: "View Projects",
      description: "Toggle the projects you want to view :arrow_down:",
      fields: [],
    });

    // Creating an actionRow
    const actionRow = new ActionRowBuilder();
    const { buttons } = client;
    // Pull from the database all of the buttons that the company has to offer
    // For now we will just create two buttons

    const button = new ButtonBuilder()
      .setLabel("Discord & Beyond")
      .setCustomId("toggleViewRole:1113541353402536088:Discord & Beyond")
      .setStyle("Primary")
      .setEmoji("🌐");

    const button2 = new ButtonBuilder()
      .setLabel("Sound & Color")
      .setCustomId("toggleViewRole:1115208435336749056:Sound & Color")
      .setStyle("Primary")
      .setEmoji("🎨")

    actionRow.addComponents(button);
    actionRow.addComponents(button2);

    await interaction.deleteReply();
    await interaction.channel.send({
      embeds: [embed],
      components: [actionRow],
    });
  },
};

// ONBOARDING STEPS
// await interaction.deferReply();
// // Creating the embed
// const embed = new EmbedBuilder({
//   "id": 703906876,
//   "title": "Onboarding Next Steps",
//   "description": "‎ \n:one:︱Introduce yourself to the team in\n\n⋙<#1114080237609828474>\n\n:two:︱Create accounts for third-party tools\n\n<:notion:1113652415619666003> `-` [Notion](https://www.notion.so/)\n<:miro:1113657553843392584> `-` [Miro](https://miro.com/)\n<:github:1115195977574395996> `-` [GitHub](https://github.com/)\n\n:three:︱Review the different projects The Verse has to offer\n\n‎⋙<#1114299372721668137>\n\n:four: ︱Create team member profile",
//   "image": {
//     "url": "https://images.sharefaith.com/images/3/1363818089219_168/1363818089219_1682.jpg"
//   },
//   "fields": []
// });

// // Creating the button
// const button1 = new ButtonBuilder()
//   .setLabel("Introductions")
//   .setStyle(ButtonStyle.Link)
//   .setURL(
//     "https://discord.com/channels/1110377897916629083/1114080237609828474"
//   );

// const button2 = new ButtonBuilder()
//   .setLabel("Projects")
//   .setStyle(ButtonStyle.Link)
//   .setURL(
//     "https://discord.com/channels/1110377897916629083/1114299372721668137"
//   );

// const button3 = new ButtonBuilder()
//   .setCustomId("createProfile")
//   .setLabel("Create Profile")
//   .setEmoji("👥")
//   .setStyle(ButtonStyle.Primary);

// const actionRow = new ActionRowBuilder();

// actionRow
//   .addComponents(button1)
//   .addComponents(button2)
//   .addComponents(button3);

// await interaction.deleteReply();
// await interaction.channel.send({
//   embeds: [embed],
//   components: [actionRow],
// });

// CREATING VIEW PROJECTS EMBED
// await interaction.deferReply();

// // Creating the embed
// const embed = new EmbedBuilder({
//   id: 703906876,
//   title: "View Projects",
//   description: "Toggle the projects you want to view :arrow_down:",
//   fields: [],
// });

// // Creating an actionRow
// const actionRow = new ActionRowBuilder();
// const { buttons } = client;
// // Pull from the database all of the buttons that the company has to offer
// // For now we will just create two buttons

// const button = new ButtonBuilder()
//   .setLabel("Discord & Beyond")
//   .setCustomId("hello")
//   .setStyle("Primary")
//   .setEmoji("🌐")

// actionRow.addComponents(button);

// buttons.set("hello", {
//   data: {
//     name: "hello",
//   },
//   async execute(interaction, client) {
//     interaction.reply("This is the button that is created");
//   },
// });

// await interaction.deleteReply();
// await interaction.channel.send({
//   embeds: [embed],
//   components: [actionRow],
// });
