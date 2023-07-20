const Member = require('../../../../models/member')

module.exports = {
    name: 'messageCreate',
    async execute(interaction, client) {
        try {
            const member = await Member.findOne({ discordId: interaction.author.id }).populate('projects')

            const channel = await client.channels.fetch(interaction.channelId)

            if (member.projects.find(project => project.categoryId === channel.parentId)) {
                // Check to see if the message count is set for the user, if it is then increase the count.
                if (!member.weeklyMessageCount) {
                    member.weeklyMessageCount = 1;
                }
                member.weeklyMessageCount += 1;
                
                member.save();
            }
            console.log(Math.floor((interaction.createdTimestamp + 345600000) / 604800000))
            console.log((Math.floor(interaction.createdTimestamp / 86400000) + 4) % 7)
            console.log(new Date(interaction.createdTimestamp).getUTCDay())
        } catch (error) {
            console.log(error)
        }
    }
}