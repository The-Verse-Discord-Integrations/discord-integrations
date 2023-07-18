const express = require("express");
const app = express();
const config = require("../../utils/config");
const cors = require("cors");
const mongoose = require("mongoose");
const { requestLogger } = require("../../utils/middleware");
const path = require('path')
const session = require('express-session');
const passport = require('passport');
const discordStrategy = require('./strategies/discordstrategies')

// Routes
const onFormSubmitRouter = require("./controllers/onFormSubmit");
const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/user')

app.use(session({
    secret: 'something that is random',
    cookie: {
        maxAge: 60000 * 60 * 24 * 30
    },
    resave: false,
    saveUninitialized: false,
    name: 'discord.oauth2'
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Middleware
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Middleware routes
app.use("/api/formSubmit", onFormSubmitRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

module.exports = app;
