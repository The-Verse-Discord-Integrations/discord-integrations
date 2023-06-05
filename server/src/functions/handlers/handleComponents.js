const fs = require("fs");

module.exports = (client) => {
  client.handleComponents = async () => {
    const componentFolders = fs.readdirSync("./src/components");
    for (const folder of componentFolders) {
      const componentFiles = fs
        .readdirSync(`./src/components/${folder}`)
        .filter((file) => file.endsWith(".js"));

      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            const button = require(`../../components/${folder}/${file}`);
            const { buttons } = client;
            buttons.set(button.data.name, button);
          }
          break;

        default:
          break;
      }
    }
  };
};
