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

authRouter.post('/logout', (request, response) => {
    request.logout(() => {
        response.send(200)
    })
})
module.exports = authRouter