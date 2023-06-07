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
  description: String,
  creationDate: new Date("<YYYY-mm-dd>"),
  owner: {
    type: String,
    required: true,
  },
  nodes: [
    // Ref to project type
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    }
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
