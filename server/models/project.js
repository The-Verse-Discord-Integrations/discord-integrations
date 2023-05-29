const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  manager: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  startDate: new Date("<YYYY-mm-dd>"),
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

projectSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
