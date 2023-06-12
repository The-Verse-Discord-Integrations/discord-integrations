const onFormSubmitRouter = require("express").Router();

onFormSubmitRouter.post("/onBoarding", async (request, response) => {
    response.send("hello I got the request")
})

module.exports = onFormSubmitRouter