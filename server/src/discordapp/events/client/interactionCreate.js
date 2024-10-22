const { InteractionType } = require('discord.js')

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        /***
         * Chat "/" Comand
         */
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.log(err);
                await interaction.reply({
                    content: "something went wrong when executing this command",
                    ephemeral: true,
                });
            }
            /***
             * BUTTON CLICK
             */
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            try {
                // Handler for the toggle view role embed
                if (customId.slice(0, "toggleViewRole".length) === "toggleViewRole")
                    await handleToggleViewRole(interaction, client, customId);

                //Handler for every other button click
                else {
                    const button = buttons.get(customId);

                    if (!button)
                        return new Error("there is no code for this button");


                    await button.execute(interaction, client);
                }
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);

            if (!modal) return new Error("There is no code for this modal");

            try {
                await modal.execute(interaction, client)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.isStringSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);

            if (!menu) return new Error("There is no code for this select menu")

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.log(error)
            }
        }
    },
};


/***
 * Toggles the specific role for the user who interacted with the button
 */
async function handleToggleViewRole(interaction, client, customId) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const data = customId.split(":");
        const roleId = data[1];
        const projectName = data[2];

        // Check to see if they have the role
        if (interaction.member.roles.cache.some((role) => role.id === roleId)) {
            // remove the role
            await interaction.member.roles.remove(roleId);
            return await interaction.editReply({
                content: `You are no longer viewing ${projectName}`,
            });
        }
        // add the role
        await interaction.member.roles.add(roleId);
        return await interaction.editReply({
            content: `You can now view ${projectName}`,
        });
    } catch (error) {
        console.log(error);
        return await interaction.editReply({ content: "Bot currently down" });
    }
}