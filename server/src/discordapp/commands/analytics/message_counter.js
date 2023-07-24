const Discord = require('discord.js');
const { ChannelType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const mongoose = require('mongoose');
//where am i connecting to mongodb server
const Member = require('./member.js'); //importing user schema to get username, messages, and last messagedate, but need to update somehow?
const messageCreateHandler = require('./messageCreateHandler');


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

        
                const messageCount = userMessages.length;
                
                await interaction.editReply(`<@${targetUser}> has sent ${messageCount} messages this week.`)
                                        
            }      
        }
        
        /*message.guild.channels.cache.forEach(channel => {
  channel.messages.fetch().then(messages => {
    messages.forEach(msg => console.log(msg.content));
  });
}); */

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

