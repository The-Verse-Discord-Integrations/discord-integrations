const userRouter  = require("express").Router();
const passport = require('passport');
const checkAuthentication = require('../utils/checkAuthentication')
const client = require('../../discordapp/discordapp')

userRouter.get("/profile", checkAuthentication, async (request, response) => {

    // We have to convert the mongodb object to a javascript object so we can mutate it
    const user = request.user.toObject()

    // Fetching the users's avatar from the client
    const userDiscObj = await client.users.fetch(user.discordId);
    user.avatarURL = userDiscObj.avatarURL();

    user.selfProfile = true;

    let weeklyMessageCountArray = Array.from(user.weeklyMessageCount.entries())
    weeklyMessageCountArray = weeklyMessageCountArray.map(array => {
        const newArray = Array.from(array[1].values())
        return [array[0], newArray[0], newArray[1]]
    })
   
    user.weeklyMessageCountArray = weeklyMessageCountArray
    return response.send(user)
})

module.exports = userRouter