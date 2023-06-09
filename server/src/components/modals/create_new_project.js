const Server = require("../../../models/server");
const Member = require("../../../models/member");

module.exports = {
    data: {
        name: "create_new_node",
    },
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        // Check to make sure the user has the permission to perform the command
        const guildId = interaction.guild.id;
        const newNodeName = interaction.fields.getTextInputValue("node_name");
        const guildData = await Server.findOne({
            guildId: guildId,
        }).populate({
            path: "managers",
        });

        if (!guildData) {
            return await interaction.editReply("Contact support")
        }
        
        const isManager = guildData.managers.some(
            (manager) => manager.discordId === interaction.user.id
        );

        if (!isManager) {
            console.log("is not manager");
            return await interaction.editReply({
                content:
                    "You do not have the permission to perform this command",
                ephemeral: true,
            });
        }

        await interaction.editReply({
            content: `Building ${newNodeName} node. This may take a few seconds.`,
            ephemeral: true,
        });

        // Build new node
    },
};
