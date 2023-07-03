const { EmbedBuilder } = require("@discordjs/builders")
const Member = require("../../../../models/member");
const moment = require('moment')

module.exports = {
    data: {
        name: "createProfile"
    },
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const member = await Member.findOne({ discordId: interaction.user.id });

        // If member doesn't exist send the base form
        if (!member) return await interaction.editReply({
            embeds: [new EmbedBuilder({
                "description": `⇛ [Here](https://docs.google.com/forms/d/e/1FAIpQLScp-DgUJO6xphUo3YYanQ0B2F2LM5klsbE6d2g8PHlT04kxuQ/viewform?usp=pp_url&entry.578353494=${interaction.user.id}) ⇚`,
                "fields": [],
                "title": "Create Profile",
                "thumbnail": {
                    "url": "https://static.thenounproject.com/png/70749-200.png"
                },
                "footer": {
                    "text": "Your Discord username is pre-filled"
                }
            })],
            ephemeral: true
        })

        // Send edit form link
        let FormString = `https://docs.google.com/forms/d/e/1FAIpQLScp-DgUJO6xphUo3YYanQ0B2F2LM5klsbE6d2g8PHlT04kxuQ/viewform?usp=pp_url`
        FormString += ('&entry.1212418319=' + member.name.replaceAll(' ', '+')) // Member Name
        FormString += ('&entry.578353494=' + member.discordId); // Discord Username
        FormString += ('&entry.1951748198=' + member.miro); // Miro Email
        FormString += ('&entry.1823084540=' + (member.github ? member.github : '')); // Github
        for (const role of member.roles) {
            FormString += ('&entry.1552503439=' + role.replaceAll(' ', '+')) // Roles
        }
        for (const skill of member.skills) {
            FormString += ('&entry.207583866=' + skill.replaceAll(' ', '+')) // Skills
        }
        FormString += ('&entry.1394881724=' + (member.goals[0] ? member.goals[0].replaceAll(' ', '+') : '')); // Goal1
        FormString += ('&entry.371240497=' + (member.goals[1] ? member.goals[1].replaceAll(' ', '+') : '')); // Goal 2
        FormString += ('&entry.1706664848=' + (member.goals[2] ? member.goals[2].replaceAll(' ', '+') : '')); // Goal 3
        FormString += ('&entry.133348054=' + (member.weeklyHours ? member.weeklyHours : ''))
        FormString += ('&entry.1928638530=' + moment(member.startDate).add(1, 'days').format('YYYY-MM-DD')) // Start Date
        FormString += ('&entry.758443668=' + moment(member.endDate).add(1, 'days').format('YYYY-MM-DD')) // End Date

        return await interaction.editReply({
            embeds: [new EmbedBuilder({
                "description": `⇛ [Here](${FormString}) ⇚`,
                "fields": [],
                "title": "Edit Profile",
                "thumbnail": {
                    "url": "https://static.thenounproject.com/png/70749-200.png"
                },
                "footer": {
                    "text": "Your profile will be pre-filled"
                }
            })],
            ephemeral: true
        })

    }
}