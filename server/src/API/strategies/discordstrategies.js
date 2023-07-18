const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const { DISC_CLIENTID, DISC_CLIENT_SECRET, DISC_CLIENT_REDIRECT } = require("../../../utils/config")
const Member = require('../../../models/member')

passport.serializeUser(function (user, done) {
    console.log('serializing')
    done(null, user.discordId)
})

passport.deserializeUser(async function (id, done) {
    console.log('deserial')

    const user = await Member.findOne({ discordId: id })
    if (user) return done(null, user);
    done("error")
})

passport.use(new DiscordStrategy({
    clientID: DISC_CLIENTID,
    clientSecret: DISC_CLIENT_SECRET,
    callbackURL: DISC_CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await Member.findOne({ discordId: profile.id })

        if (!user) {
            
        }
        console.log('here')
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error, null)
    }
})) 
