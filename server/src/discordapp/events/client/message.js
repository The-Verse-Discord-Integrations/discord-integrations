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
        } catch (error) {
            console.log(error)
        }
    }
}