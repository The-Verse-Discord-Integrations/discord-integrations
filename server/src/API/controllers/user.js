const userRouter  = require("express").Router();
const passport = require('passport');
const checkAuthentication = require('../utils/checkAuthentication')

userRouter.get("/profile", checkAuthentication, (request, response) => {
    console.log('here')
    response.send(request.user)
})

module.exports = userRouter