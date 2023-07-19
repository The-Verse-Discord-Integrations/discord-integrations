const authRouter  = require("express").Router();
const passport = require('passport');

// Localhost:xxxx/auth
authRouter.get('/', passport.authenticate('discord', {
    failureRedirect: '/login',
}));

authRouter.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
}))

module.exports = authRouter