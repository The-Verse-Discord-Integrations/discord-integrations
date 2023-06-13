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

        await interaction.editReply({
            content: `Building ${newProjectName} node. This may take a few seconds.`,
            ephemeral: true,
        });

        // Build Node and populate Database
        await buildProject(interaction, newProjectName);
    },
};

const buildProject = async function (interaction, newProjectName) {
    // const embed = new EmbedBuilder({
    //     "id": 734916372,
    //     "title": "🛠️ Creating New Node...",
    //     "description": "Building new node. This may take a few seconds.\n\n{Progress Bar}\n",
    //     "fields": []
    //   })
    const newRoles = await buildRoles(interaction, newProjectName);
    const newChannels = await buildChannels(interaction, newProjectName);
    console.log(newChannels);
};

const buildRoles = async function (interaction, newProjectName) {};
const buildChannels = async function (interaction, newProjectName) {
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
            }
        ];
        category = await interaction.guild.channels.create({
            name: newProjectName,
            type: ChannelType.GuildCategory,
        });
        channels.push(category);

        for (const channel of newChannels) {
            const newChannel = await interaction.guild.channels.create({
                name: channel.name,
                type: channel.type,
                parent: category
            })
            channels.push(newChannel);
        }
        // throw "error";
        return channels;
    } catch (error) {
        channels.forEach(async (channel) => {
            await channel.delete();
        });
        await interaction.editReply(
            "An Error has occurred please contact support"
        );
        console.log(error);
    }
};
