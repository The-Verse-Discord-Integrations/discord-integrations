const userRouter  = require("express").Router();
const passport = require('passport');
const checkAuthentication = require('../utils/checkAuthentication')

userRouter.get("/profile", checkAuthentication, (request, response) => {
    response.send(200)
})

module.exports = userRouter