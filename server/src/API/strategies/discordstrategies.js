const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const { DISC_CLIENTID, DISC_CLIENT_SECRET, DISC_CLIENT_REDIRECT } = require("../../../utils/config")
const Member = require('../../../models/member')

passport.serializeUser(function (id, done) {
    console.log('serializing')
    done(null, id)
})

passport.deserializeUser(async function (id, done) {
    console.log('deserializing')
    done(null, id)
})

passport.use(new DiscordStrategy({
    clientID: DISC_CLIENTID,
    clientSecret: DISC_CLIENT_SECRET,
    callbackURL: DISC_CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
    done(null, profile.id)
})) 
