const Member = require('../../../../models/member')
const { EmbedBuilder } = require("discord.js");
const cloneUtility = require('lodash');
const client = require('../../discordapp')
const dinoId = "203237501832265730";

/**
 * DATA STRUCTURE: (Datastructure used in mongodb)
 * member.weeklyMessageCount = {
 *      2975: {      (hashMapKey representing each week)
 *            totalCount: 2       (Total Messages for that week: ex:2)
 *            dailyCount: [0, 1, 1, 0, 0, 0 ,0]     (An array representing each day in that week)
 *      },
 *      2976 : {
 *            totalCount: 12
 *            dailyCount: [2, 5, 0, 5, 0, 0, 0]
 *      },
 *      2977 : {
 *            totalCount: 0
 *            dailyCount: [0, 0, 0, 0, 0, 0, 0]
 *      },
 *      2978 : {
 *            totalCount: 1
 *            dailyCount: [1, 0, 0, 0, 0, 0, 0]
 *      }
 *  
 * }
 */

module.exports = {
    name: 'messageCreate',


    async execute(interaction, client) {
        try {
            // Calculate the week number to be used as the key for the weeklyMessageCount map
            const hashMapKey = (Math.floor((interaction.createdTimestamp + 345600000) / 604800000)).toString()

            // Get the day index (0-6) for the received message (0: Sunday, 1: Monday, ..., 6: Saturday)
            const dailyIndex = new Date(interaction.createdTimestamp).getUTCDay();

            // Find the member's data in the MongoDB database based on their Discord ID
            const member = await Member.findOne({ discordId: interaction.author.id }).populate('projects')

            // If the member is not found, return and do nothing
            if (!member) return

            const channel = await client.channels.fetch(interaction.channelId)  //needed?

            // If the member does not have a weeklyMessageCount map yet, initialize it
            if (!member.weeklyMessageCount) {
                const weeklyMessageCountMap = new Map();
                member.weeklyMessageCount = weeklyMessageCountMap
            }

            /** If the member did not send a message in the current week we will run 2 pieces of functionality
             *  Part 1: line-41
             *  Part 2: line-62
             * */
            
            if (!member.weeklyMessageCount.has(hashMapKey)) {
                
                /**
                 * PART 1: Check to see if they have any empty weeks inbetween the last time they sent a message and the current message.
                 *         IF they do add the empty weeks into their messageCount datastructure. This will make it easier for the front-end
                 * 
                 */
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

                /**
                 * Part 2: If it is the first message of the week then we will create a new HashMapKey for this week and increment the total count
                 */
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