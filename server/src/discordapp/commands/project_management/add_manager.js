const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_manager')
		.setDescription('Add a manager to the node (owner command)'),
	async execute(interaction) {
        console.log(interaction)
	},
};