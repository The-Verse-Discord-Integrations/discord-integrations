const Server = require("../../../models/server");
const Member = require("../../../models/member");

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        try {
            const response = await guild.fetchOwner();
            const ownerId = response.user.id;
            const name = response.user.username;

            let populatedMember = await Member.findOne({ discordId: ownerId })
            
            if (!populatedMember) {
                populatedMember = await Member.create({
                    name: name,
                    discordId: ownerId,
                });
            }

            let populatedServer = await Server.findOne({ guildId: guild.id})
            
            if (!populatedServer) {
                populatedServer = await Server.create({
                    name: guild.name,
                    guildId: guild.id,
                    owner: populatedMember,
                    managers: [populatedMember],
                    members: [populatedMember]
                })

                console.log("New server has been created")
            } else {
                if (ownerId === populatedServer.owner) console.log("server already exists, welcome back")
                else {
                    populatedServer.owner = ownerId;
                    populatedServer = await populatedServer.save()
                    console.log("Server already exists, server owner has been updated")
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};
