const { SlashCommandBuilder, ChannelType } = require("discord.js");
const client = require('../../discordapp');
const { Channel } = require("diagnostics_channel");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("build_project")
        .setDescription("Replies with pong"),

    async execute(interaction) {
        await interaction.reply('building')
        
        const guildID = interaction.guild.id;

        try {
            const guild = await interaction.client.guilds.fetch(guildID)
            const category = await guild.channels.create({
                name: "new-channel",
                type: ChannelType.GuildCategory,
            })

            await guild.channels.create({
                name: "text-channel",
                type: ChannelType.GuildText,
                parent: category
            })
            // {
            //     name: "new-channel",
            //     type: ChannelType.GuildText,
            //     parent: '1110377899304947772',
            // }
        } catch (error) {
            console.error(error)
        }
    }
}
