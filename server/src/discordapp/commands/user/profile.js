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
            option.setName("user").setDescription("The input to echo back")
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

        const userData = await Member.findOne({ discordId: userId });
        if (!userData) {
            return await interaction.editReply(
                "This user has not created a profile yet"
            );
        }
        const userDiscObj = await interaction.client.users.fetch(userId);
        const avatarURL = userDiscObj.avatarURL();

        const embed = new EmbedBuilder({
            id: 703906876,
            title: `👥 ${userData.name}'s profile`,
            description:
            `__**Username**__: ${userData.discordUsername}\n\n<:miro:1113657553843392584> `-` ${userData.miro}\n<:github:1115195977574395996> `-` ${userData.github}\n\n`,
            fields: [
                {
                    id: 995872137,
                    name: "__Roles__",
                    value: "Web Developer, Game Developer",
                },
                {
                    id: 231043629,
                    name: "__Skills__",
                    value: "List of skills",
                },
                {
                    id: 395181531,
                    name: "__Achievements__",
                    value: "Achievements",
                },
            ],
            thumbnail: {
                url: avatarURL,
            },
            color: 61695,
        });
        
        await interaction.editReply({
            embeds: [embed]
        })
    },
};
