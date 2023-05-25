const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong"),

    async execute(interaction) {
        await interaction.reply({ content: "hello", ephemeral: true });
        await interaction.followUp({ content: "second hello", ephemeral: true });
        await interaction.deleteReply();
    }
}