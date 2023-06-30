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
        .setName("toolbox_create_onboarding_steps")
        .setDescription("Creates an embed"),
    async execute(interaction, client) {
        await interaction.deferReply();
        // Creating the embed
        const embed = new EmbedBuilder({
            id: 703906876,
            title: "Onboarding Next Steps",
            description:
                "‎ \n:one:︱Introduce yourself to the team in\n\n⋙<#848805950282268692>\n\n:two:︱Create accounts for third-party tools\n\n<:notion:1113652415619666003> `-` [Notion](https://www.notion.so/)\n<:miro:1113657553843392584> `-` [Miro](https://miro.com/)\n<:github:1115195977574395996> `-` [GitHub](https://github.com/)\n\n:three:︱Review the different projects The Verse has to offer\n\n‎⋙<#1121516748596838602>\n\n:four: ︱Create team member profile",
            image: {
                url: "https://images.sharefaith.com/images/3/1363818089219_168/1363818089219_1682.jpg",
            },
            fields: [],
        });

        // Creating the button
        const button1 = new ButtonBuilder()
            .setLabel("Introductions")
            .setStyle(ButtonStyle.Link)
            .setURL(
                "https://discord.com/channels/848804519847526460/848805950282268692"
            );

        const button2 = new ButtonBuilder()
            .setLabel("View Nodes")
            .setStyle(ButtonStyle.Link)
            .setURL(
                "https://discord.com/channels/848804519847526460/1121516748596838602"
            );

        const button3 = new ButtonBuilder()
        .setLabel("Create Profile")
        .setCustomId(`createProfile`)
        .setStyle("Primary")

        const actionRow = new ActionRowBuilder();

        actionRow
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3);

        await interaction.deleteReply();
        await interaction.channel.send({
            embeds: [embed],
            components: [actionRow],
        });
    },
};