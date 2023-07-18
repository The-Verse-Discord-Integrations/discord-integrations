const Discord = require('discord.js');
const { ChannelType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose');
//where am i connecting to mongodb server
const Member = require('./member.js'); //importing user schema to get username, messages, and last messagedate, but need to update somehow?



    const User = mongoose.model('User', userSchema); //Create new collection to make interactions easier

    const userSchema = new mongoose.Schema({
        username: String,
        messages: Number,
        lastMessageDate: Date,
    });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly_messages')
        .setDescription('See how many messages a user sent this week')
        .addUserOption((option) => option.setName("user").setDescription("Who's message count do you want to see?").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
    
        async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
        await interaction.deferReply({ ephemeral: true })
            
        const client = new Discord.Client();  //Handle events
        const targetUser = interaction.options.getUser('user').id



        try{
            const startDate = moment().startOf('isoWeek').toDate();
            const endDate = moment().endOf('isoWeek').toDate();
        
            const guild = client.guilds.cache.get(DISC_GUILDID); //Using cache to reduce database accesses. Figure out how to use cache to update message counts periodically if runtime is too much
            //unnecesary checks can go around if get guild directly from instructions command
            if (guild) {
    
              const member = await Member.findOne({ discordId: targetUser }) //check targetUser is a member in the server

              if (!member) return await interaction.editReply("This user is not a member of the server")


              if (member) {
                const userMessages = await guild.channels.cache.reduce(async (accPromise, channel) => {     //fetch texts from each channel (??)
                  const acc = await accPromise;
                  if (channel.isText()) {   //check the channels being processed are only text channels
                    const messages = await channel.messages.fetch({ limit: 100 }); //Staying within by API limits by rate limiting (can process 5000/10sec)
                    const messagesFromUser = messages.filter((msg) => msg.author.id === targetUser);    //filter for only messages sent by user
                    const messagesWithinRange = messagesFromUser.filter(
                      (msg) =>
                        msg.createdAt >= startDate &&
                        msg.createdAt <= endDate
                    );
                    acc.push(...messagesWithinRange.array());   //push onto array
                  }
                  return acc;
                }, []);
        
                const messageCount = userMessages.length;
                
                await interaction.editReply(`<@${targetUser}> has sent ${messageCount} messages this week.`)
                                        
            }      
        }
        

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

