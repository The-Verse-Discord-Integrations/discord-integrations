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
        const newOwnProfile = await Member.findOne({ discordId: inputUserId }).populate("projects"); //finding new owner's profile

        if (!newOwnProfile) return await interaction.editReply("This user has yet to create a profile") //checking if new owner has profile

        // @ERROR: The if statement condition will be true if the .find method returns back an object. Since for the .find condition you are looking for a member.discordId !== newOwner it will always return back true returning the wrong member object
        // @Suggestion: The .find method will return undefined if the element is not found in the members array. So you can combine this with a not operator (!) to create a condition that looks like this if(!project.members.find()).
        // This will first look through the project.members array and find a member that matches the id. If there isn't one meaning the .find method returned undefined the condition will evaluate to true adding the member to the project because of the not operator (!)
        // adding newOwner to members array is not already there
        if (project.members.find((member) => member.discordId !== newOwner)) { 

            project.members.push(newOwnProfile._id);
            newOwnProfile.projects.push(project._id);
            await project.save();
            await newOwnProfile.save();
        }

        // @ERROR: project.owner is actually a variable that holds a reference to a document (member) in the members collection (in mongodb)
        // We should just be able to reassign the variable to the new owner object._id which would look like this:
        // project.owner = newOwnProfile._id
        //change project owner ID to newOwnProfile Id. project.owner.id = newOwnProfile ID
        if (project.owner.find((owner) => owner.discordId !== newOwner)) {

            project.owner.push(newOwnProfile._id);
        }


        //adding new owner to managers array
        // @HERE: Since the new owner could already be a manager we also want to check if they are inside the managers array using the index.of method.
        project.managers.push(newOwnProfile._id);
        // project.members.indexOf(newManager._id) === -1 && project.members.push(newManager._id) // @DELETE
        project.save();

        // give new owner manager role and take away viewer and creative 
        // @CHANGE: change the newManagerDiscObj to newOwnProfile
        const newManagerDiscObj = await interaction.guild.members.fetch(inputUserId);
        newManagerDiscObj.roles.add(project.roles[0].id) // Manager Role
        newManagerDiscObj.roles.remove(project.roles[1].id) // Creator Role
        newManagerDiscObj.roles.remove(project.roles[2].id) // Viewing Role


        // @HERE: Since we want to touch the database as little as possible we could move the project.save() on line 46 out here so it is only saved once

        await interaction.editReply(`<@${newOwner}> has been tranferred ownership for the ${project.name} node`)

            //Check if commandUser = project.current owner
            // inputUserID = search member profile
            //if not member profile then make one by adding to members array
            //change owner id to switch ownership
            //add new owner to manager array
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