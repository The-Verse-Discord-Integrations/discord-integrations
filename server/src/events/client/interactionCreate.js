module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
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
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;

      // Handler for the toggle view role embed
      if (customId.includes("toggleRole")) {

        await interaction.deferReply({ ephemeral: true });

        try {
          const data = customId.split(":");
          const roleId = data[1];
          const projectName = data[2];

          // Check to see if they have the role
          if (
            interaction.member.roles.cache.some((role) => role.id === roleId)
          ) {
            // remove the role
            interaction.member.roles.remove(roleId);
            return await interaction.editReply({
              content: `You are no longer viewing ${projectName}`,
            });
          }
          // add the role
          interaction.member.roles.add(roleId);
          return await interaction.editReply({
            content: `You can now view ${projectName}`,
          });
        } catch (error) {
          console.log(error);
          return await interaction.reply({ content: "Bot currently down" })
        }
      } else {
        const button = buttons.get(customId);

        if (!button) return new Error("there is no code for this button");

        try {
          await button.execute(interaction, client);
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
};
