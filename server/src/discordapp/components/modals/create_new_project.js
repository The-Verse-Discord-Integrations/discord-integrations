const Server = require("../../../../models/server");
const Member = require("../../../../models/member");
const Project = require("../../../../models/project");
const { ChannelType, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "create_new_node",
    },
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        // Check to make sure the user has the permission to perform the command
        const guildId = interaction.guild.id;
        const newProjectName = interaction.fields.getTextInputValue("node_name");
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

        // Send Building Embed
        await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨");

        // Build Node and populate Database
        let roles = await buildRoles(interaction, newProjectName);
        let category;
        let dashBoardId;
        let channels = [];
        let newProject;
        try {
            const newChannels = [
                {
                    name: "💬︱chat",
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
             * BUILDING CATEGORY AND CHANNELS
             */

            // Building the category
            category = await interaction.guild.channels.create({
                name: newProjectName,
                type: ChannelType.GuildCategory,
            });
            channels.push(category);

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨▪️");

            // Building overview channel and grabbing id
            const overviewChannel = await interaction.guild.channels.create({
                name: "🌐︱overview",
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[0],
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[1],
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: roles[2],
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            channels.push(overviewChannel);

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️");

            // Send dashboard embed to the overview channel
            // @params{ interaction, overviewChannel }
            dashBoardId = await overviewChannelEmbed(interaction, overviewChannel);

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️▪️");

            // Building project channel and grabbing id
            const projectsForum = await interaction.guild.channels.create({
                name: "📂︱projects",
                type: ChannelType.GuildForum,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[0],
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[1],
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[2],
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            channels.push(projectsForum);

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️▪️🏎️ 💨▪️▪️▪️▪️");

            const dailyStandup = await interaction.guild.channels.create({
                name: "📅︱daily-stand-up",
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[0],
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[1],
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: roles[2],
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            channels.push(dailyStandup);

            // Building the rest of the channels
            for (const channel of newChannels) {
                const newChannel = await interaction.guild.channels.create({
                    name: channel.name,
                    type: channel.type,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: roles[0],
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: roles[1],
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: roles[2],
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });
                channels.push(newChannel);
            }

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️▪️🏎️ 💨▪️▪️▪️▪️▪️");

            /**
             * MONGODB INTERACTIONS
             */

            // Creating new project profile in the database
            newProject = await Project.create({
                name: newProjectName,
                dashBoardId: dashBoardId,
                projectsForumId: projectsForum.id,
                owner: manager,
                managers: [manager],
                members: [manager],
                categoryId: category.id,
                roles: [
                    { name: "manager", id: roles[0].id },
                    { name: "creator", id: roles[1].id },
                    { name: "viewing", id: roles[2].id },
                ],
            });

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️▪️🏎️ 💨▪️▪️▪️▪️▪️▪️");

            // Adding the project to the users profile project array
            // await Member.updateOne({ discordId: manager.discordId }, { $push: { projects: newProject } });
            manager.projects.push(newProject)
            await manager.save()

            await sendBuildingEmbed(interaction, newProjectName, "▪️▪️🏎️ 💨▪️▪️▪️▪️▪️▪️▪️");

            // Add the Project to the Sever database
            // const server = await Server.updateOne({ guildId: guildId }, { $push: { projects: newProject } });
            server.projects.push(newProject)
            if (server.projects.length > 25) throw "error"
            await server.save()

            await sendBuildingEmbed(interaction, newProjectName, "▪️🏎️ 💨▪️▪️▪️▪️▪️▪️▪️▪️");

            // Give the user the manager role
            await interaction.member.roles.add(roles[0].id);

            if (server.viewProjectsEmbed.channelId) {
                // Update view node embed
                const viewNodeEmbedChannel = await interaction.client.channels.fetch(server.viewProjectsEmbed.channelId)
                const viewNodeEmbedMessage = await viewNodeEmbedChannel.messages.fetch(server.viewProjectsEmbed.embedId)

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

                // const actionRow = new ActionRowBuilder();
                // for (const project of server.projects) {
                //     const button = new ButtonBuilder()
                //         .setLabel(project.name)
                //         .setCustomId(`toggleViewRole:${project.roles[2].id}:${project.name}`)
                //         .setStyle("Primary")

                //     actionRow.addComponents(button);
                // }
                // Creating actionRows array
                const actionRows = []
                for (let i = 0; i < server.projects.length; i++) {
                    if (i % 5 === 0) {
                        actionRows.push(new ActionRowBuilder())
                    }
                    const button = new ButtonBuilder()
                        .setLabel(server.projects[i].name)
                        .setCustomId(`toggleViewRole:${server.projects[i].roles[2].id}:${server.projects[i].name}`)
                        .setStyle("Primary")

                    actionRows[actionRows.length - 1].addComponents(button);
                }

                // Editing the existing embed
                await viewNodeEmbedMessage.edit({
                    embeds: [embed],
                    components: actionRows
                })
            }

            // Send finished embed
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        id: 734916372,
                        title: `✅ New Node Successfully Created ✅`,
                        description: `${newProjectName} Node has been created\n
                        Check <#${overviewChannel.id}>`,
                        fields: [],
                        color: 65283,
                    }),
                ],
            });
        } catch (error) {
            // IF an error occurs it will delete all of the roles, channels, and database profiles that were created.
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: `❌ ERROR OCCURED ❌`,
                        description: "Reverting build\n\nplease contact support",
                        color: 16711680,
                    }),
                ],
            });
            for (const role of roles) {
                await interaction.guild.roles.delete(role.id);
            }
            for (const channel of channels) {
                await channel.delete();
            }
            if (newProject) {
                await Project.deleteOne({ name: newProject.name });
                await Member.updateMany({}, { $pull: { projects: newProject._id } });
                await Server.updateMany({}, { $pull: { projects: newProject._id } });
            }
            console.log(error);
        }
    },
};

/***
 * Building Roles
 */
const buildRoles = async function (interaction, newProjectName) {
    const managerRole = await interaction.guild.roles.create({
        name: `${newProjectName} Manager`,
    });
    const creatorRole = await interaction.guild.roles.create({
        name: `${newProjectName} Creator`,
    });
    const viewingRole = await interaction.guild.roles.create({
        name: `${newProjectName} Viewing`,
    });

    return [managerRole, creatorRole, viewingRole];
};

/***
 * Sending Dashboard Embed to overview Channel
 */

const overviewChannelEmbed = async function (interaction, overviewChannel) {
    const embed = new EmbedBuilder({
        id: 437590445,
        description: "This is an embed!",
        fields: [],
    });

    const actionRow = new ActionRowBuilder();

    const newEmbed = await overviewChannel.send({
        embeds: [embed],
        // components: [actionRow],
    });

    return newEmbed.id;
};

const sendBuildingEmbed = function (interaction, newProjectName, progressText) {
    return interaction.editReply({
        embeds: [
            new EmbedBuilder({
                id: 734916372,
                title: `🛠️ Creating New Node...`,
                description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁${progressText}\n`,
                fields: [],
                color: 32255,
            }),
        ],
    });
};
