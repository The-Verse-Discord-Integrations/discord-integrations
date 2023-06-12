const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_new_node")
        .setDescription("Creates new node"),
    async execute(interaction) {
        // Send the Modal to get the name of the project that is being created
        const modal = new ModalBuilder()
            .setCustomId("create_new_node")
            .setTitle("The Verse Management Tool");

        const textInput = new TextInputBuilder()
            .setCustomId("node_name")
            .setLabel("What is the name of the new node?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        await interaction.showModal(modal);
    },
};
