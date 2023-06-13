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
            ephemeral: true,
            embeds: [new EmbedBuilder({
                id: 734916372,
                title: `🛠️ Creating New Node...`,
                description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨\n`,
                fields: [],
            })],
        });

        // Build Node and populate Database
        await buildProject(interaction, newProjectName);
    },
};

const buildProject = async function (
    interaction,
    newProjectName,
    progressBar,
    message
) {
    const newRoles = await buildRoles(interaction, newProjectName);
    await interaction.editReply({
        ephemeral: true,
        embeds: [new EmbedBuilder({
            id: 734916372,
            title: `🛠️ Creating New Node...`,
            description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️\n`,
            fields: [],
        })],
    });
    const newChannels = await buildChannels(interaction, newProjectName);
    await interaction.editReply({
        ephemeral: true,
        embeds: [new EmbedBuilder({
            id: 734916372,
            title: `🛠️ Creating New Node...`,
            description: `Building ${newProjectName}. This may take a few seconds.\n\n🏁▪️▪️▪️▪️▪️▪️🏎️ 💨▪️▪️▪️▪️\n`,
            fields: [],
        })],
    });
};

const buildRoles = async function (interaction, newProjectName) {};
const buildChannels = async function (interaction, newProjectName) {
    let category;
    let channel;
    let channels = [];

    try {
        category = await interaction.guild.channels.create({
            name: newProjectName,
            type: ChannelType.GuildCategory,
        });
        channels.push(category);

        channel = await interaction.guild.channels.create({
            name: "🌐︱overview",
            type: ChannelType.GuildText,
            parent: category,
        });
        channels.push(channel);
        const position = channel.rawPosition + 1;
        channel = await interaction.guild.channels.create({
            name: "📂︱projects",
            type: ChannelType.GuildForum,
            parent: category,
        });
        channels.push(channel);

        channel = await interaction.guild.channels.create({
            name: "💬︱chat",
            type: ChannelType.GuildText,
            parent: category,
        });
        channels.push(channel);

        channel = await interaction.guild.channels.create({
            name: "📅︱daily-stand-up",
            type: ChannelType.GuildText,
            parent: category,
        });
        channels.push(channel);

        channel = await interaction.guild.channels.create({
            name: "🔗︱links",
            type: ChannelType.GuildText,
            parent: category,
        });
        channels.push(channel);

        channel = await interaction.guild.channels.create({
            name: "❓︱questions-and-answers",
            type: ChannelType.GuildText,
            parent: category,
        });
        channels.push(channel);
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        async function myFunction() {
            await delay(5000); // 20 seconds delay
            console.log("After 20 seconds");
            // Write your code here that should run after the delay
        }

        myFunction();
        throw "error";
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
