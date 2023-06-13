const onFormSubmitRouter = require("express").Router();
const client = require("../../discordapp/discordapp");
const Member = require("../../../models/member");
const Server = require("../../../models/server");
const { DISC_GUILDID } = require("../../../utils/config");

onFormSubmitRouter.post("/onBoarding", async (request, response) => {
    try {
        const formAnswers = Object.values(request.body.form);
        const fUsername = formAnswers[0];
        const fMiro = formAnswers[1];
        const fGithub = formAnswers[2];
        const fRoles = formAnswers[3];
        const fSkills = formAnswers[6];
        const fStartDate = formAnswers[7];
        const fEndDate = formAnswers[8];

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

        if (!found) return; // SEND A MESSAGE TO ME OR BEN ABOUT THE FORM NOT BEING SUBMITTED CORRECTLY
    
        // Create user profile
        const member = await Member.create({
            name: fUsername,
            discordId: discordId,
            miro: fMiro,
            github: fGithub,
            startDate: fStartDate,
            endDate: fEndDate,
        });
        
        const result = await Server.updateOne(
            { guildId: DISC_GUILDID },
            { $addToSet: { members: member } }
        );

        // SEND MESSAGE TO BEN THAT HE PERSON HAS FINISHED THEIR ONBOARDING
    } catch (error) {
        console.log(error);
    }
});

module.exports = onFormSubmitRouter;
