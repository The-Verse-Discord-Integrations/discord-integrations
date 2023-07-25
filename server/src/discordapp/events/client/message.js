const Member = require('../../../../models/member')

module.exports = {
    name: 'messageCreate',


    async execute(interaction, client) {
        try {


            const hashMapKey = (Math.floor((interaction.createdTimestamp + 345600000) / 604800000)) //Hashmap key represents week count
            const dayIndex = new Date(interaction.createdTimestamp).getUTCDay() //hashmap subkey is array with 7 indexes, each corresponding to day of the week
            const weeklyMessageCount =0; //Calculated at end 

            const member = await Member.findOne({ discordId: interaction.author.id }).populate('projects').populate(messageCount)

            const channel = await client.channels.fetch(interaction.channelId)

            const messageCount = new Member({
                hashMapField: {
                  key1: hashMapKey,
                  key2: [0, 0, 0, 0, 0, 0, 0],
                  key3: weeklyMessageCount,
                }
              });

            

            
            
            //checking if new week key needs to be created or same week
            if(!member.messageCount.hashMapKey.find(hashMapKey => messageCount.hashMapKey === hashMapKey)){
                const messageCount = {
                    hashMapKey: { //dont know if this function gives hashmapkey's value as name for hashmap
                      dayCount: new Array(6).fill(0),
                      weeklyMessageCount: 1,
                    },
                  };
                member.messageCount.hashMapKey. = hashMapKey;
                member.messageCount.key2 = [0, 0, 0, 0, 0, 0, 0];
                member.messageCount.key3 = weeklyMessageCount;

                member.save;
            } else {
                member.messageCount.key2.[dayIndex]++;
                member.messageCount.
            }

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