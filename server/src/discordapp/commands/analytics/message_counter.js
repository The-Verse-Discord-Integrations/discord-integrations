const Discord = require('discord.js');
const { ChannelType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose');
//where am i connecting to mongodb server
const Member = require('./member.js'); //importing user schema to get username, messages, and last messagedate, but need to update somehow?



//const User = mongoose.model('User', userSchema); //Create new collection to make interactions easier


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

              
                const startDate = moment().startOf('week');
                const endDate = moment().endOf('week');

                const searchResults = await message.guild.search({
                content: `from:${targetUser}`,
                before: endDate.toISOString(),
                after: startDate.toISOString(),
                });

                const messageCount = searchResults.reduce((count, result) => count + result.total, 0);
                            
                await interaction.editReply(`<@${targetUser}> has sent ${messageCount} messages this week.`)
                  


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


/* const userSchema = new mongoose.Schema({
    username: String,
    messages: Number,
    lastMessageDate: Date,
});


const startDate = moment().startOf('isoWeek').toDate();
                  const endDate = moment().endOf('isoWeek').toDate();
              
                  const guild = client.guilds.cache.get(DISC_GUILDID); //Figure out how to use cache to update message counts periodically if runtime is too much
              
                  if (guild) {
                    const member = guild.members.cache.find((member) => member.user.id === user.id);
                    if (member) {
                      const userMessages = await guild.channels.cache.reduce(async (accPromise, channel) => {
                        const acc = await accPromise;
                        if (channel.isText()) {
                          const messages = await channel.messages.fetch({ limit: 100 }); //Staying within by API limits by rate limiting
                          const messagesFromUser = messages.filter((msg) => msg.author.id === user.id);
                          const messagesWithinRange = messagesFromUser.filter(
                            (msg) =>
                              msg.createdAt >= startDate &&
                              msg.createdAt <= endDate
                          );
                          acc.push(...messagesWithinRange.array());
                        }
                        return acc;
                      }, []);
              
                      const messageCount = userMessages.length;
              
                      message.reply(
                        `User ${targetUser} has sent ${messageCount} messages this week.`
                      );
                    } else {
                      message.reply('User not found in the guild.');
                    }*/