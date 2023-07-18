const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_task')
		.setDescription('Create a task for a project and assign it to a person')
        .addUserOption((option) => option.setName("user").setDescription("Who are you assigning the task to?").setRequired(true)),
	async execute(interaction) {
		await interaction.reply({
            content: 'hello',
            ephemeral: true
        })
	},
};