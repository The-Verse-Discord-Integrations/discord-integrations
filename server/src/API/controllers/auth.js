const authRouter  = require("express").Router();
const passport = require('passport');

// Localhost:xxxx/auth
authRouter.get('/', passport.authenticate('discord'));

authRouter.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/home'
}))

module.exports = authRouter