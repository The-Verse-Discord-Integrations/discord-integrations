const Member = require('../../../../models/member')
const cloneUtility = require('lodash');

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
        }
    }
}