const Project = require('../../../../models/project');
const Member = require("../../../../models/member");

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_manager')
        .setDescription('Add a manager to the node (owner command)'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })
        const categoryId = interaction.channel.parentId
        const userId = interaction.user.id

        // Make sure the command is executed inside the node
        if (!categoryId) return await interaction.editReply("You can only execute this command inside a node")

        // Grab the node from the database
        const project = await Project.findOne({ categoryId: categoryId }).populate("owner");

        // Check to make sure the user is the owner of the node
        if (userId !== project.owner.discordId) return await interaction.editReply("You do not have the permission to perform this command")

        // Grab the inputed user from the database
        console.log(project)
        // Add the user to the managers array and to the member array if they aren't already in there

        // Give the user the manager role and take away the viewer role and the creator role. 
    },
};