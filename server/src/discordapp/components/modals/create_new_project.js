const Server = require("../../../../models/server");
const Member = require("../../../../models/member");
const Project = require("../../../../models/project");
const {
    ChannelType,
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
} = require("discord.js");

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
        let roles = await buildRoles(interaction, newProjectName);
        let category;
        let dashBoardId;
        let projectsForumId;
        let channels = [];
        try {
            const newChannels = [
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
             * BUILDING CATEGORY AND CHANNELS
             */

            // Building the category
            category = await interaction.guild.channels.create({
                name: newProjectName,
                type: ChannelType.GuildCategory,
            });
            channels.push(category);

            // Building overview channel and grabbing id
            const overviewChannel = await interaction.guild.channels.create({
                name: "🌐︱overview",
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
                    },
                    {
                        id: roles[0],
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
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

            // Send dashboard embed to the overview channel
            // @params{ interaction, overviewChannel }
            dashBoardId = await overviewChannelEmbed(
                interaction,
                overviewChannel
            );

            // Building project channel and grabbing id
            const projectsForum = await interaction.guild.channels.create({
                name: "📂︱projects",
                type: ChannelType.GuildForum,
                parent: category,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
                    },
                    {
                        id: roles[0],
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages,
                        ],
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
            channels.push(projectsForum);
            projectsForumId = projectsForum.id;

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
                            allow: [
                                PermissionsBitField.Flags.ViewChannel,
                            ],
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
            const newProject = await Project.create({
                name: newProjectName,
                dashBoardId: dashBoardId,
                projectsForumId: projectsForumId,
                managers: [manager],
                members: [manager],
                categoryId: category.id,
                roles: [
                    { name: "manager", id: roles[0] },
                    { name: "creator", id: roles[1] },
                    { name: "viewing", id: roles[2] },
                ],
            });
        } catch (error) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: `❌ERROR OCCURED❌`,
                        description:
                            "Reverting build\n\nplease contact support",
                    }),
                ],
            });
            for (const role of roles) {
                await interaction.guild.roles.delete(role.id);
            }
            for (const channel of channels) {
                await channel.delete();
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
    // const embed = new EmbedBuilder({});

    // const actionRow = new ActionRowBuilder();
    // actionRow.addComponents();

    // const newEmbed = await overviewChannel.send({
    //     embeds: [embed],
    //     components: [actionRow],
    // });

    // return newEmbed.id;
};
