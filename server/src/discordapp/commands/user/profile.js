const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
} = require("discord.js");
const Member = require("../../../../models/member");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Responds with the users profile")
        .addStringOption((option) =>
            option.setName("user").setDescription("The user you are trying to search")
        ),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true,
        });
        let userId = interaction.options.getString("user");

        if (!userId) {
            userId = interaction.user.id;
        } else {
            userId = userId.slice(2, userId.length - 1);
        }

        const userData = await Member.findOne({ discordId: userId }).populate({
            path: "projects",
        });
        
        if (!userData) {
            return await interaction.editReply(
                "This user has not created a profile yet"
            );
        }
        const userDiscObj = await interaction.client.users.fetch(userId);
        const avatarURL = userDiscObj.avatarURL();
        const fields = [
            {
                name: "__Roles__",
                value: `${userData.roles.join(", ")}`,
            },
            {
                name: "__Skills__",
                value: `${userData.skills.join(", ")}`,
            },
            {
                name: "__Achievements__",
                value: "Achievements",
            },
        ];

        if (userData.projects.length > 0) {
            fields.unshift({
                name: "__Projects__",
                value: `${userData.projects
                    .map((project) => project.name)
                    .join(", ")}`,
            });
        }

        const embed = new EmbedBuilder({
            id: 703906876,
            title: `👥 ${userData.name}'s profile`,
            description:
                `__**Username**__: ${userData.discordUsername}\n\n<:miro:1113657553843392584> ` -
                ` ${userData.miro}\n<:github:1115195977574395996> ` -
                ` ${userData.github}\n\n`,
            fields: fields,
            thumbnail: {
                url: avatarURL,
            },
            color: 61695,
        });
        await interaction.editReply({
            embeds: [embed],
        });
    },
};
