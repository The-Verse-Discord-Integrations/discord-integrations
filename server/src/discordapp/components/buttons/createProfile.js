const { EmbedBuilder } = require("@discordjs/builders")

module.exports = {
    data: {
        name: "createProfile"
    },
    async execute(interaction, client) {
        await interaction.reply({
            embeds: [new EmbedBuilder({
                "description": `⇛ [Here](https://docs.google.com/forms/d/e/1FAIpQLScp-DgUJO6xphUo3YYanQ0B2F2LM5klsbE6d2g8PHlT04kxuQ/viewform?usp=pp_url&entry.578353494=${interaction.user.username}) ⇚`,
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
    }
}