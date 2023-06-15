const onFormSubmitRouter = require("express").Router();
const client = require("../../discordapp/discordapp");
const Member = require("../../../models/member");
const Server = require("../../../models/server");
const { DISC_GUILDID } = require("../../../utils/config");
const { EmbedBuilder } = require("discord.js");

const dinoId = '203237501832265730';

onFormSubmitRouter.post("/onBoarding", async (request, response) => {
    try {
        const formAnswers = Object.values(request.body.form);
        const fName = formAnswers[0]
        const fUsername = formAnswers[1];
        const fMiro = formAnswers[2];
        const fGithub = formAnswers[3];
        const fRoles = formAnswers[4];
        const fSkills = formAnswers[9];
        const fStartDate = formAnswers[10];
        const fEndDate = formAnswers[11];

        // Check to make sure the discord user is correct in the server
        const guildMembers = await client.guilds.cache
            .get(DISC_GUILDID)
            .members.fetch();
        let found = false;
        let discordId;
        guildMembers.forEach((member) => {
            if (member.user.username === fUsername) {
                found = true;
                discordId = member.user.id;
            }
        });

        if (!found) {
            return await client.users.cache.get(dinoId).send({
                embeds: [new EmbedBuilder({
                    "id": 437590445,
                    "description": `__name of person__ inputed the username: ${fUsername}, It was not found in the server`,
                    "fields": []
                  })],
            });
        }; 

        // Check to see if the user already has a profile
        let member = await Member.findOne({ discordId: discordId });

        // Create user profile
        if (!member) {
            member = await Member.create({
                name: fUsername,
                discordId: discordId,
                miro: fMiro,
                github: fGithub,
                startDate: fStartDate,
                endDate: fEndDate,
            });
        }

        // const result = await Server.updateOne(
        //     { guildId: DISC_GUILDID },
        //     { $addToSet: { members: member } }
        // );

        // SEND MESSAGE TO BEN THAT THE PERSON HAS FINISHED THEIR ONBOARDING

        // Send a message to the user in discord that their onboarding is complete.
        await client.users.cache.get(discordId).send({
            embeds: [new EmbedBuilder({
                "id": 437590445,
                "description": "This is an embed!",
                "fields": []
              })],
        });

        // Remove the onboarding role
    } catch (error) {
        console.log(error);
    }
});

module.exports = onFormSubmitRouter;
