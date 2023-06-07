module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        const response = await guild.fetchOwner()
        const ownerId = response.user.id;
        console.log(ownerId)
    }
}