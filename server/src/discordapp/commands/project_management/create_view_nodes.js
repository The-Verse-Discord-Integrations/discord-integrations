const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const Server = require('../../../../models/server');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create_view_nodes")
        .setDescription("Creates an view projects embed"),
    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            // Make sure the user is a manager
            const guildId = interaction.guild.id;
            const server = await Server.findOne({ guildId: guildId, }).populate({ path: "managers" }).populate({ path: "projects" })

            if (!server) return await interaction.editReply("Contact support");

            const manager = server.managers.find((manager) => manager.discordId === interaction.user.id);
            if (!manager) {
                console.log("is not manager");
                return await interaction.editReply({
                    content: "You do not have the permission to perform this command",
                    ephemeral: true,
                });
            }

            // Creating the embed
            const embed = new EmbedBuilder({
                id: 703906876,
                title: "View Nodes",
                description: "Toggle the nodes you want to view :arrow_down:",
                fields: [],
                thumbnail: {
                    url: "https://media.licdn.com/dms/image/C560BAQGZsRf5Ro6Zbg/company-logo_200_200/0/1631752036761?e=2147483647&v=beta&t=kVWNkg1BQJDVWm4UhD8L8OmOLxhx_xc2Kc_-V_hC7DQ",
                },
            });

            // Creating an actionRow
            const actionRow = new ActionRowBuilder();

            // Pull from the database all of the buttons that the company has to offer
            for (const project of server.projects) {
                const button = new ButtonBuilder()
                    .setLabel(project.name)
                    .setCustomId(`toggleViewRole:${project.roles[2].id}:${project.name}`)
                    .setStyle("Primary")

                actionRow.addComponents(button);
            }

            // Sending the embed back to the client
            await interaction.deleteReply();
            const viewNodeEmbed = await interaction.channel.send({
                embeds: [embed],
                components: actionRow.components.length ? [actionRow] : undefined,
            });

            //Adding the embedId to the server in the database
            server.viewProjectsEmbed = { channelId: interaction.channel.id, embedId: viewNodeEmbed.id };
            server.save()
        } catch (error) {
            console.log(error)
            await interaction.editReply("An error has occurred please contact support")
        }
    },
};