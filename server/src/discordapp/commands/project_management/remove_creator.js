const { SlashCommandBuilder } = require("discord.js");
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
            const manager = project.managers.find((manager) => {
                return manager.discordId === cmdUserId;
            });

            if (!manager) return await interaction.editReply("You do not have the permissions to perform this command");

            // @GUARD: Check to see if the inputed user is a manager, another manager cannot kick another manager
            if (project.managers.find((manager) => manager.discordId === inputUserId))
                return await interaction.editReply("This user is a manager. Please use the /remove_manager command then use the /remove_creator command");

            // Okay now we know the command user is a manager and the inputted user is not a manager. We can now update the project members array so it doesnt include the inputted user and then we need to remove the project from the users project array.

            let userFound;
            project.members = project.members.filter((member) => {
                if (member.discordId !== inputUserId) return true;

                userFound = member;
                return false;
            })

            console.log(userFound)
            //@GUARD: Check to see if the use is a
            // // @GUARD: Check to see if the user is already a creator
            // if (project.members.find((member) => member.discordId === inputUserId)) return await interaction.editReply("This user is already a creator")

            // // Grab the new creators profile from the database
            // const newCreator = await Member.findOne({ discordId: inputUserId }).populate("projects");

            // // @GUARD: Check to make sure the user has a profile in the database
            // if (!newCreator) return await interaction.editReply("This user has yet to create a profile")

            // // Add the user as a creator in the projects database
            // project.members.push(newCreator._id);
            // newCreator.projects.push(project._id);
            // await project.save();
            // await newCreator.save();

            // // Give the user the roles in the discord server
            // const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
            // newManagerDiscObj.roles.add(project.roles[1].id) // Creator Role
            // newManagerDiscObj.roles.remove(project.roles[2].id) // Viewing Role

            // await interaction.editReply(`<@${inputUserId}> has been added as a creator for the ${project.name} node`)
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
