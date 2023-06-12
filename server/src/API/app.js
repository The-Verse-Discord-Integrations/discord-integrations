const express = require("express");
const app = express();
const config = require("../../utils/config");
const cors = require("cors");
const mongoose = require("mongoose");
const { requestLogger } = require("../../utils/middleware");

// Routes
const onFormSubmitRouter = require("./controllers/onFormSubmit");

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api/formSubmit", onFormSubmitRouter);

app.get("*", (req, res) => {
    res.send("Yes I am online");
});

module.exports = app;
