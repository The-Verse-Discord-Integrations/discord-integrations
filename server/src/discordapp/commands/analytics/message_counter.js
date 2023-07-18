const Discord = require('discord.js');
const { ChannelType, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
//where am i connecting to mongodb server
const Member = require('member.js'); //importing user schema to get username, messages, and last messagedate, but need to update somehow?

const userSchema = new mongoose.Schema({
    username: String,
    messages: Number,
    lastMessageDate: Date,
});

const User = mongoose.model('User', userSchema);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('weekly_messages')
        .setDescription('See how many messages a user sent this week')
        .addUserOption((option) => option.setName("user").setDescription("Who's message count do you want to see?").setRequired(true))
        .addBooleanOption((option) => option.setName("confirmation").setDescription("Please confirm this command").setRequired(true)),
    
        async execute(interaction) {
        if (!interaction.options.getBoolean("confirmation")) return await interaction.reply({ content: "Please confirm command", ephemeral: true })
        await interaction.deferReply({ ephemeral: true })
            
        const client = new Discord.Client();
        
        try{

            client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}`);
            });

            client.on('messageCreate', async (message) => {
            if (message.content.startsWith('/messages')) {
                const args = message.content.split(' ');
                const targetUser = args[1];

                const user = await User.findOne({ username: targetUser });
                if (!user) {
                message.reply('User not found.');
                return;
                }

                const startDate = moment().startOf('isoWeek').toDate();
                const endDate = moment().endOf('isoWeek').toDate();

                const messages = await message.channel.messages.fetch({
                limit: 100,
                });

                const userMessages = messages.filter(
                (msg) =>
                    msg.author.id === user.id &&
                    msg.createdAt >= startDate &&
                    msg.createdAt <= endDate
                );

                message.reply(
                `User ${targetUser} has sent ${userMessages.size} messages this week.`
                );
            }
            });



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


