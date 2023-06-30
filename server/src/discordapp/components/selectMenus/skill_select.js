const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: {
        name: 'skillSelect'
    },
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        await interaction.deleteReply(interaction.message)

        const dinoId = '203237501832265730'
        const brandonhoward = '748322593844494487'
        const skill = interaction.values[0]

        await client.users.fetch(dinoId).then(user => user.send({
            embeds: [
                new EmbedBuilder({
                    id: 437590445,
                    description: `**${interaction.user.username}** is looking to learn __${skill}__`,
                    fields: [],
                }),
            ],
        }))

        await client.users.fetch(brandonhoward).then(user => user.send({
            embeds: [
                new EmbedBuilder({
                    id: 437590445,
                    description: `**${interaction.user.username}** is looking to learn __${skill}__`,
                    fields: [],
                }),
            ],
        }))

        return await interaction.editReply(`A ${skill} mentor will be in contact with you`)
    },
}