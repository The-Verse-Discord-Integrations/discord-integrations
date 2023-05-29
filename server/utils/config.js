require("dotenv").config();

let DISC_TOKEN = process.env.DISC_TOKEN
let DISC_CLIENTID = process.env.DISC_CLIENTID
let DISC_GUILDID = process.env.DISC_GUILDID
let MONGODB_URI = process.env.MONGODB_URI

module.exports = {
    DISC_TOKEN,
    DISC_CLIENTID,
    DISC_GUILDID,
    MONGODB_URI
}