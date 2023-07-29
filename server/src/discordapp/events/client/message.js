const Member = require('../../../../models/member')
const { EmbedBuilder } = require("discord.js");
const cloneUtility = require('lodash');
const client = require('../../discordapp')
const dinoId = "203237501832265730";

module.exports = {
    name: 'messageCreate',


    async execute(interaction, client) {
        try {
            const hashMapKey = (Math.floor((interaction.createdTimestamp + 345600000) / 604800000)).toString() //Hashmap key represents week count
            const dailyIndex = new Date(interaction.createdTimestamp).getUTCDay() //hashmap subkey is array with 7 indexes, each corresponding to day of the week
            const weeklyMessageCount = 0;

            const member = await Member.findOne({ discordId: interaction.author.id }).populate('projects')
            if (!member) return

            const channel = await client.channels.fetch(interaction.channelId)  //needed?

            // If they don't have the hashmap data structure yet implement it
            if (!member.weeklyMessageCount) {
                const weeklyMessageCountMap = new Map();
                member.weeklyMessageCount = weeklyMessageCountMap
            }

            // If they don't have the current week as a key in the hashmap create it
            if (!member.weeklyMessageCount.has(hashMapKey)) {
                // Check if there are any missing weeks where the user did not send a message
                // We will find the last week the user sent a message and find the offset to the current week.
                // We will then create a hashmapkey for those empty weeks with a totalCount of 0 for each.
                const currentMessageCountArray = Array.from(member.weeklyMessageCount.keys())
                const lastWeekHashMapKey = parseInt(currentMessageCountArray[currentMessageCountArray.length - 1])

                let offset = parseInt(hashMapKey) - lastWeekHashMapKey
                offset = offset ? offset : 0

                if (offset > 1) {
                    for (let i = 1; i < offset; i++) {
                        const intraWeeklyMessageCountMap = new Map();
                        intraWeeklyMessageCountMap.set('totalCount', 0);
                        const dailyCountArray = new Array(7).fill(0);
                        intraWeeklyMessageCountMap.set('dailyCount', dailyCountArray)
                        member.weeklyMessageCount.set((lastWeekHashMapKey + i).toString(), intraWeeklyMessageCountMap)
                    }
                }

                // If it is a new week create the new hashMap 
                const intraWeeklyMessageCountMap = new Map();

                intraWeeklyMessageCountMap.set('totalCount', 1);

                const dailyCountArray = new Array(7).fill(0);
                dailyCountArray[dailyIndex]++;
                intraWeeklyMessageCountMap.set('dailyCount', dailyCountArray)

                member.weeklyMessageCount.set(hashMapKey, intraWeeklyMessageCountMap)

            } 

            // Increment the totalCount for the week and increment the count in the corresponding index in the dailyCount array
            else {
                const map = new Map();
                map.set('totalCount', member.weeklyMessageCount.get(hashMapKey).get('totalCount') + 1)
                const newArray = member.weeklyMessageCount.get(hashMapKey).get('dailyCount')
                newArray[dailyIndex]++
                map.set('dailyCount', newArray)

                member.weeklyMessageCount.set(hashMapKey, map)

            }
            console.log(member.weeklyMessageCount)
            return await member.save()
        } catch (error) {
            console.log(error)
            return await client.users.fetch(dinoId).then(user => user.send({
                embeds: [
                    new EmbedBuilder({
                        id: 437590445,
                        description: error,
                        fields: [],
                    }),
                ],
            }))
        }
    }
}