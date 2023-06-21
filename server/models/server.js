const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  viewProjectsEmbed: {
    channelId: String,
    embedId: String,
  },
  projects: [
    // Ref to project type
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  managers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    }
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    }
  ],
});

serverSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Server = mongoose.model("Server", serverSchema);

module.exports = Server;
