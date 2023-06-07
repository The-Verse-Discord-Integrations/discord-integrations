const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_new_project")
        .setDescription("Creates new project"),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("test-modal")
            .setTitle("name?");

        const textInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("What is your name?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);


        modal.addComponents(new ActionRowBuilder().addComponents(textInput))

        await interaction.showModal(modal);
    },
};
