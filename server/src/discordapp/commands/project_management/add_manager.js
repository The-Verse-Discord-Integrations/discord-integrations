const Project = require('../../../../models/project');
const Member = require("../../../../models/member");

const { ChannelType, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_manager')
        .setDescription('Add a manager to the node (owner command)')
        .addUserOption((option) => option.setName("user").setDescription("The user to be added as a manager").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
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
            const project = await Project.findOne({ categoryId: categoryId }).populate("owner")

            // @GUARD: Check to make sure the project exists
            if (!project) return await interaction.editReply("You can only execute this command inside a node")

            // @GUARD: Check to make sure the user is the owner of the node
            if (cmdUserId !== project.owner.discordId) return await interaction.editReply("You do not have the permission to perform this command")

            // Grab the inputed user from the database
            const newManager = await Member.findOne({ discordId: inputUserId })

            // @GUARD: Check to make sure the user exists
            if (!newManager) return await interaction.editReply("This user has yet to create a profile")

            // @GUARD: Check to make sure the user is not already a manager
            if (project.managers.indexOf(newManager._id) !== -1) return await interaction.editReply("This user is already a manager")

            // Add the user to project managers array
            project.managers.push(newManager._id);
            project.members.indexOf(newManager._id) === -1 && project.members.push(newManager._id)
            project.save();

            // If the project is not in the users project array add it
            if (newManager.projects.indexOf(project._id) === -1) {
                newManager.projects.push(project)
                await newManager.save()
            }

            // Give the user the manager role and take away the viewer role and the creator role.
            const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
            await newManagerDiscObj.roles.add(project.roles[0].id) // Manager Role
            await newManagerDiscObj.roles.remove(project.roles[1].id) // Creator Role
            await newManagerDiscObj.roles.remove(project.roles[2].id) // Viewing Role

            



            await interaction.editReply(`<@${inputUserId}> has been promoted to Manager for the ${project.name} node`)
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