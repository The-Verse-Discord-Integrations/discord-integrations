const Discord = require('discord.js');
const { ChannelType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Member = require('../../../../models/member'); //importing user schema to get username, messages, and last messagedate, but need to update somehow?
const Project = require('../../../../models/project');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly_messages')
        .setDescription('See how many messages a user sent this week')
        .addUserOption((option) => option.setName("user").setDescription("Who's message count do you want to see?").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
    
        async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
        await interaction.deferReply({ ephemeral: true })
            
        const inputUser = interaction.options.getUser('user').id
        //Find the day and week references that the slash command was sent
        const currDay = new Date(interaction.createdTimestamp).getUTCDay();
        const currWeek = (Math.floor((interaction.createdTimestamp + 345600000) / 604800000)).toString();


        
        try{
            
            //Find inputUser's member profile
            const targetUser = await Member.findOne({ discordId: inputUser }).populate('weeklyMessageCount')
            
            //Edge case if targetUser does not have a user profile
            if (!targetUser) return await interaction.editReply("This user has yet to create a profile")

            //Check if the current week exists in the user's weeklyMessageCount object
            if (!targetUser.weeklyMessageCount.has(currWeek)) {
            return await interaction.editReply(`<@${inputUser}> has not sent any messages this week.`);
            }
            
            //Get message counts for week and current day 
            const currWeekCount = targetUser.weeklyMessageCount.get(currWeek).get('totalCount');
            const currDayCount = targetUser.weeklyMessageCount.get(currWeek).get('dailyCount')[currDay];

        await interaction.editReply(`<@${inputUser}> has sent ${currDayCount} messages today, with a total of ${currWeekCount} messages this week.`)
                                             

        


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
    }
}

