const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    data: {
        name: 'startMentorshipSkill'
    },
    async execute(interaction, client) {
        // const dinoId = '203237501832265730'
        // const brandonhoward = '748322593844494487'

        // const data = customId.split(":");

        await interaction.deferReply({ ephemeral: true })

        // await client.users.fetch(dinoId).then(user => user.send({
        //     embeds: [
        //         new EmbedBuilder({
        //             id: 437590445,
        //             description: `**${interaction.user.username}** is looking to learn __${data[1]}__`,
        //             fields: [],
        //         }),
        //     ],
        // }))


        // await client.users.fetch(brandonhoward).then(user => user.send({
        //     embeds: [
        //         new EmbedBuilder({
        //             id: 437590445,
        //             description: `**${interaction.user.username}** is looking to learn __${data[1]}__`,
        //             fields: [],
        //         }),
        //     ],
        // }))

        // return await interaction.editReply("A mentor will be in contact with you")
        const skills = ['Unity', 'Unreal', 'JavaScript', 'Python', 'HTML/CSS', 'C++', 'UI/UX', 'Product Management', 'Research', 'Sound Design', 'Visual Design', 'Communication Design', 'Social Media', 'Leadership', 'React'];

        const skillOptions = [];

        for (const skill of skills) {
            const skillSelect = new StringSelectMenuOptionBuilder()
                .setLabel(skill)
                .setValue(skill)

            skillOptions.push(skillSelect)
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('skillSelect')
            .setPlaceholder('Pick a skill!')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(...skillOptions)

        const actionRow = new ActionRowBuilder().addComponents(menu)

        await interaction.editReply({
            content: "choose a skills",
            components: [actionRow]
        })
    }
}