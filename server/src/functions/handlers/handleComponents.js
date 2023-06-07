const fs = require("fs");

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentFolders = fs.readdirSync("./src/components");
        for (const folder of componentFolders) {
            const componentFiles = fs
                .readdirSync(`./src/components/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { buttons, modals } = client;

            switch (folder) {
                case "buttons":
                    for (const file of componentFiles) {
                        const button = require(`../../components/${folder}/${file}`);
                        buttons.set(button.data.name, button);
                    }
                    break;
                case "modals":
                    for (const file of componentFiles) {
                        const modal = require(`../../components/${folder}/${file}`);
                        modals.set(modal.data.name, modal);
                    }
                    break;
                default:
                    break;
            }
        }
    };
};