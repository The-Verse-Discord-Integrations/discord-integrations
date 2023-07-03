const Project = require('../../../../models/project');
const Member = require("../../../../models/member");

const { ChannelType, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer_owner')
        .setDescription('Transfer ownership of a project')
        .addUserOption((option) => option.setName("user").setDescription("The user to be made owner").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
    async execute(interaction) {
            if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
            await interaction.deferReply({ ephemeral: true })
            console.log(interaction);

            const categoryId = interaction.channel.parentId
            const cmdUserId = interaction.user.id // person giving command
            const newOwner = interaction.options.getUser('user').id //user becoming owner


    try {

        const project = await Project.findOne({ categoryId: categoryId }).populate("managers").populate("members") //get the project
        const currOwner = project.owner.discordId

        if (!categoryId) return await interaction.editReply("You can only execute this command inside a node") 
        if (!project) return await interaction.editReply("You can only execute this command inside a node")

        //check if person giving command is already owner
        if (cmdUserId !== currOwner) return await interaction.editReply("You must be owner of this project to transfer ownership")

        //check if newOwner is already in member array, if not add them
        const newOwnProfile = await Member.findOne({ discordId: newOwner }).populate("projects"); //finding new owner's profile

        if (!newOwnProfile) return await interaction.editReply("This user has yet to create a profile") //checking if new owner has profile

        // adding newOwner to members array if not already there
        if (!project.members.find((member) => member.discordId === newOwner)) { //if there is no member such that their discordID matches the newOwn/ no newOwn member

            project.members.push(newOwnProfile._id);
            newOwnProfile.projects.push(project._id);
            await newOwnProfile.save();
        }
    
        if (project.managers.indexOf(newOwnProfile._id) === -1){ //checking if new owner is already inside managers array
            project.managers.push(newOwnProfile._id);  //adding new owner to managers array
        }
        
        
        
        project.owner = newOwnProfile._id; //making newOwnProfile the owner

        // give new owner manager role and take away viewer and creative 
        newOwnProfile.roles.add(project.roles[0].id) // Manager Role
        newOwnProfile.roles.remove(project.roles[1].id) // Creator Role
        newOwnProfile.roles.remove(project.roles[2].id) // Viewing Role

        await project.save(); //reduce amount of times we access database


        await interaction.editReply(`<@${newOwner}> has been tranferred ownership for the ${project.name} node`)


      }  catch (error) {
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