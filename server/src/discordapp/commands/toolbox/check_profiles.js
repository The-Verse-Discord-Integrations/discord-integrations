const { SlashCommandBuilder, InteractionCollector } = require('discord.js');
const Server = require('../../../../models/server');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toolbox_check_profiles')
        .setDescription('Finds all the users that have not create a profile yet'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        try {
            // Check to make sure the user has the permission to perform the command
            const guildId = interaction.guild.id;
            const server = await Server.findOne({ guildId: guildId, }).populate({ path: "managers" }).populate({ path: "members" })

            if (!server) return await interaction.editReply("Contact support");

            const manager = server.managers.find((manager) => manager.discordId === interaction.user.id);
            if (!manager) {
                console.log("is not manager");
                return await interaction.editReply({
                    content: "You do not have the permission to perform this command",
                    ephemeral: true,
                });
            }

            let csvData = 'Username, DiscordId\n';
            let content = ''
            const filePath = './src/discordapp/temp/check_profiles.csv';
            const members = await interaction.guild.members.fetch()
            members.forEach(member => {
                // if the member is not in the sever.members array push them to the csvData string
                if (!server.members.find(memberProfile => memberProfile.discordId === member.user.id)) {
                    csvData += `${member.user.username},${member.user.id}\n`;
                    content += `<@${member.user.id}>\n`
                }
            })

            fs.writeFile(filePath, csvData, (err) => {
                if (err) {
                    console.error('Error creating CSV file:', err);
                    return;
                }

                interaction.editReply({ content: content, files: ['./src/discordapp/temp/check_profiles.csv'] })
            });
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