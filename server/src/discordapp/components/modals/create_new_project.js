const Server = require("../../../../models/server");
const Member = require("../../../../models/member");
const Project = require("../../../../models/project");
const { ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "create_new_node",
    },
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        // Check to make sure the user has the permission to perform the command
        const guildId = interaction.guild.id;
        const newProjectName =
            interaction.fields.getTextInputValue("node_name");
        const guildData = await Server.findOne({
            guildId: guildId,
        }).populate({
            path: "managers",
        });

        if (!guildData) {
            return await interaction.editReply("Contact support");
        }

        const manager = guildData.managers.find(
            (manager) => manager.discordId === interaction.user.id
        );

        if (!manager) {
            console.log("is not manager");
            return await interaction.editReply({
                content:
                    "You do not have the permission to perform this command",
                ephemeral: true,
            });
        }

        // Send Building Embed
        await interaction.editReply({
            embeds: [
                new EmbedBuilder({
                    id: 734916372,
                    title: `🛠️ Creating New Node...`,
                    description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨\n`,
                    fields: [],
                }),
            ],
        });

        // Build Node and populate Database
        let roles = [];
        let category;
        let channels = [];
        try {
            const newChannels = [
                {
                    name: "🌐︱overview",
                    type: ChannelType.GuildText,
                },
                {
                    name: "📂︱projects",
                    type: ChannelType.GuildForum,
                },
                {
                    name: "💬︱chat",
                    type: ChannelType.GuildText,
                },
                {
                    name: "📅︱daily-stand-up",
                    type: ChannelType.GuildText,
                },
                {
                    name: "🔗︱links",
                    type: ChannelType.GuildText,
                },
                {
                    name: "❓︱questions-and-answers",
                    type: ChannelType.GuildText,
                },
            ];

            /***
             * BUILD ROLES
             */
            const managerRole = await interaction.guild.roles.create({ name: `${newProjectName} Manager` })
            const viewingRole = await interaction.guild.roles.create({ name: `${newProjectName} Viewing` })
            roles.push(managerRole, viewingRole);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        id: 734916372,
                        title: `🛠️ Creating New Node...`,
                        description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️\n`,
                        fields: [],
                    }),
                ],
            });

            /***
             * BUILDING CATEGORY AND CHANNELS
             */
            category = await interaction.guild.channels.create({
                name: newProjectName,
                type: ChannelType.GuildCategory,
            });
            channels.push(category);

            for (const channel of newChannels) {
                const newChannel = await interaction.guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: category,
                });
                channels.push(newChannel);
            }
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        id: 734916372,
                        title: `🛠️ Creating New Node...`,
                        description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️▪️▪️\n`,
                        fields: [],
                    }),
                ],
            });
            throw "error";
        } catch (error) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: `❌ERROR OCCURED❌`,
                        description: "Reverting build\n\nplease contact support",
                    }),
                ],
            });
            for (const role of roles) {
                await interaction.guild.roles.delete(role.id);
            }
            for (const channel of channels) {
                await channel.delete()
            }
            console.log(error);
        }
    },
};
