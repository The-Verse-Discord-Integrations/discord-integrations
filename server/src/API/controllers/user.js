const userRouter = require("express").Router();
const passport = require('passport');
const checkAuthentication = require('../utils/checkAuthentication')
const client = require('../../discordapp/discordapp');
const { UserFlagsBitField } = require("discord.js");

userRouter.get("/profile", checkAuthentication, async (request, response) => {
    try {
        // We have to convert the mongodb object to a javascript object so we can mutate it
        let user = await adjustForMessageOffset(request.user)
        user = user.toObject()

        // Fetching the users's avatar from the client
        const userDiscObj = await client.users.fetch(user.discordId);
        user.avatarURL = userDiscObj.avatarURL();

        user.selfProfile = true;

        if (user.weeklyMessageCount) {
            let weeklyMessageCountArray = Array.from(user.weeklyMessageCount.entries())
            weeklyMessageCountArray = weeklyMessageCountArray.map(array => {
                const newArray = Array.from(array[1].values())
                return [array[0], newArray[0], newArray[1]]
            })

            user.weeklyMessageCountArray = weeklyMessageCountArray
        }
        return response.send(user)
    } catch (error) {
        console.log(error)
        response.sendStatus(500)
    }
})

module.exports = userRouter

const adjustForMessageOffset = async (user) => {
    if (!user.weeklyMessageCount) {
        console.log('no user weeklyMessageCount')
        return user
    }
    const currentWeekHashMapKey = (Math.floor((Date.now() + 345600000) / 604800000))
    const currentMessageCountArray = Array.from(user.weeklyMessageCount.keys())
    const lastWeekHashMapKey = parseInt(currentMessageCountArray[currentMessageCountArray.length - 1])
    const offset = currentWeekHashMapKey - lastWeekHashMapKey

    if (offset > 0) {
        for (let i = 1; i <= offset; i++) {
            const intraWeeklyMessageCountMap = new Map();
            intraWeeklyMessageCountMap.set('totalCount', 0);
            const dailyCountArray = new Array(7).fill(0);
            intraWeeklyMessageCountMap.set('dailyCount', dailyCountArray)
            user.weeklyMessageCount.set((lastWeekHashMapKey + i).toString(), intraWeeklyMessageCountMap)
        }
        console.log('adjusting')
        return await user.save()

    }

    console.log('no adjustment')
    return user
}