const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const skills = ['Unity', 'Unreal', 'JavaScript', 'Python', 'HTML/CSS', 'C++', 'UI/UX', 'Product Management', 'Research', 'Sound Design', 'Visual Design', 'Communication Design', 'Social Media', 'Leadership', 'React'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("toolbox_create_mentor_select")
        .setDescription("Creates an embed"),
    async execute(interaction, client) {
        await interaction.deferReply();
        // Creating the embed
        const embed = new EmbedBuilder({
            id: 703906876,
            title: "Mentorship Program",
            description:
                "Start your journey here :arrow_down:",
            fields: [],
            image: {
                "url": "https://d57439wlqx3vo.cloudfront.net/iblock/9a7/9a765ca1eb4efa74acdcdb40ef7057ce/8777a317dbe9cbc2f2be3afa533e6d13.png"
              }
            
        });

        const actionRow = new ActionRowBuilder();
        const button = new ButtonBuilder()
                .setLabel("Start")
                .setCustomId(`startMentorshipSkill`)
                .setStyle("Primary")

        actionRow.addComponents(button)

        await interaction.deleteReply();
        await interaction.channel.send({
            embeds: [embed],
            components: [actionRow],
        });
    },
};
