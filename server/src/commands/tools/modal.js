const {
    SlashCommandBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modal")
        .setDescription("returns a modal"),
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
