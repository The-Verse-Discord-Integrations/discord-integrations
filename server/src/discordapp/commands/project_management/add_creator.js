const { SlashCommandBuilder } = require('discord.js');
const Project = require("../../../../models/project");
const Member = require('../../../../models/member');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_creator')
		.setDescription('Add a creator to a node')
        .addUserOption((option) => option.setName("user").setDescription("The user to be added as a creator").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("confirm this command").setRequired(true)),
	async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
		await interaction.deferReply({ ephemeral: true })
        const categoryId = interaction.channel.parentId
        const cmdUserId = interaction.user.id
        const inputUserId = interaction.options.getUser('user').id
        try {
            // @GUARD: Make sure the command is executed inside a category
            if (!categoryId) return await interaction.editReply("You can only execute this command inside a node")

            // Grab the node from the database
            const project = await Project.findOne({ categoryId: categoryId }).populate("managers").populate("members")

            // @GUARD: Check to make sure the project exists
            if (!project) return await interaction.editReply("You can only execute this command inside a node")

            // @GUARD: Check to make sure the user is a manager in the project
            const manager = project.managers.find((manager) => {
                return manager.discordId === cmdUserId
            })
            
            if (!manager) return await interaction.editReply("You do not have the permissions to perform this command")

            // @GUARD: Check to see if the user is already a creator
            if (project.members.find((member) => member.discordId === inputUserId)) return await interaction.editReply("This user is already a creator")

            // Grab the new creators profile from the database
            const newCreator = await Member.findOne({ discordId: inputUserId }).populate("projects");

            // @GUARD: Check to make sure the user has a profile in the database
            if (!newCreator) return await interaction.editReply("This user has yet to create a profile")

            // Add the user as a creator in the projects database
            project.members.push(newCreator._id);
            newCreator.projects.push(project._id);
            await project.save();
            await newCreator.save();

            // Give the user the roles in the discord server
            const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
            await newManagerDiscObj.roles.add(project.roles[1].id) // Creator Role
            await newManagerDiscObj.roles.remove(project.roles[2].id) // Viewing Role

            await interaction.editReply(`<@${inputUserId}> has been added as a creator for the ${project.name} node`)
        } catch (error) {
            console.log(error)
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: `❌ ERROR OCCURED ❌`,
                        description: "Reverting Process",
                        color: 16711680,
                    }),
                ],
            });
        }
	},
};