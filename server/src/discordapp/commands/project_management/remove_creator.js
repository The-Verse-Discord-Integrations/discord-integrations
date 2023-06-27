const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Project = require("../../../../models/project");
const Member = require("../../../../models/member");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove_creator")
        .setDescription("remove a creator from a node")
        .addUserOption((option) => option.setName("user").setDescription("The user to be added as a creator").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("confirm this command").setRequired(true)),
    async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation"))
            return await interaction.reply({
                content: "Please confirm command",
                ephemeral: true,
            });
        await interaction.deferReply({ ephemeral: true });
        const categoryId = interaction.channel.parentId;
        const cmdUserId = interaction.user.id;
        const inputUserId = interaction.options.getUser("user").id;
        try {
            if (cmdUserId === inputUserId) return await interaction.editReply("You cannot perform this command on yourself")

            // @GUARD: Make sure the command is executed inside a category
            if (!categoryId) return await interaction.editReply("You can only execute this command inside a node");

            // Grab the node from the database
            const project = await Project.findOne({ categoryId: categoryId }).populate("managers").populate("members");

            // @GUARD: Check to make sure the project exists
            if (!project) return await interaction.editReply("You can only execute this command inside a node");

            // @GUARD: Check to make sure the user is a manager in the project
            if (!project.managers.find((manager) => manager.discordId === cmdUserId)) return await interaction.editReply("You do not have the permissions to perform this command");
            
            // @GUARD: Check to see if the inputed user is a manager, another manager cannot kick another manager
            if (project.managers.find((manager) => manager.discordId === inputUserId))
                return await interaction.editReply("This user is a manager. Please use the /remove_manager command then use the /remove_creator command");

            // Remove the user from the members array
            let userToRemove;
            project.members = project.members.filter((member) => {
                if (member.discordId !== inputUserId) return true;

                userToRemove = member;
                return false;
            })

            // @GUARD: The user is not a creator
            if (!userToRemove) return await interaction.editReply("This user is not currently a creator")
            userToRemove.projects = userToRemove.projects.filter((project) => project._id !== project._id);

            await project.save();
            await userToRemove.save();

            // Remove the roles from the user
            const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
            newManagerDiscObj.roles.remove(project.roles[1].id) // Creator Role

            return await interaction.editReply(`<@${inputUserId}> has been removed as a creator from the ${project.name} node`)
        } catch (error) {
            console.log(error);
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
