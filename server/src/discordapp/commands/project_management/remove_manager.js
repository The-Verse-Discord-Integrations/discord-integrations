const Project = require('../../../../models/project');
const Member = require("../../../../models/member");

const { ChannelType, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove_manager')
        .setDescription('Remove a manager to the node (owner command)')
        .addUserOption((option) => option.setName("user").setDescription("The user to be added as a manager").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
    async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
        await interaction.deferReply({ ephemeral: true })
        const categoryId = interaction.channel.parentId
        const cmdUserId = interaction.user.id
        const inputUserId = interaction.options.getUser('user').id
        try {
            // @GUARD: Make sure the user doesn't use this command on themselves
            if (cmdUserId === inputUserId) return await interaction.editReply("You cannot use this command on yourself you must transfer ownership, utilize the /transfer_ownership command")

            // @GUARD: Make sure the command is executed inside a category
            if (!categoryId) return await interaction.editReply("You can only execute this command inside a node")

            // Grab the node from the database
            const project = await Project.findOne({ categoryId: categoryId }).populate("owner").populate("managers")

            // @GUARD: Check to make sure the project exists
            if (!project) return await interaction.editReply("You can only execute this command inside a node")

            // @GUARD: Check to make sure the user is the owner of the node
            if (cmdUserId !== project.owner.discordId) return await interaction.editReply("You do not have the permission to perform this command")

            // Remove the user from the managers array
            let userFound = false;
            project.managers = project.managers.filter(manager => {
                if (manager.discordId !== inputUserId) return true

                userFound = true;
                return false
            })

            // @GUARD: check to see if the user was a manager
            if (!userFound) return await interaction.editReply("This user is not currently a manger")

            project.save()

            // Remove the users manager role and give them the creator role
            const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
            newManagerDiscObj.roles.remove(project.roles[0].id)
            newManagerDiscObj.roles.add(project.roles[1].id)
            newManagerDiscObj.roles.remove(project.roles[2].id)


            await interaction.editReply(`<@${inputUserId}> has been removed as a Manager for the ${project.name} node`)
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