const Member = require('../../../models/member')
const checkAuthentication = async (request, response, next) => {
    // If no cookie redirect to login page
    if (!request.user) {
        console.log('auth failed')
        return response.sendStatus(401)
    }

    // Check to see the discord user is in the database, if not redirect to the login page
    const member = await Member.findOne({ discordId: request.user }).populate("projects")
    if (!member) {
        console.log('auth failed')
        return response.sendStatus(401)
    }
    console.log('auth success')
    request.user = member;
    return next()
}

module.exports = checkAuthentication