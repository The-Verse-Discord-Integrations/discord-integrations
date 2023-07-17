const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    discordId: {
        type: String,
        required: true,
        unique: true,
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
    skills: [
        {
            type: String,
        },
    ],
    miro: String,
    github: String,
    startDate: Date,
    endDate: Date,
    roles: [
        {
            type: String,
        },
    ],
    achievements: [
        {
            type: String,
        },
    ],
    goals: [
        {
            type: String,
        },
    ],
    weeklyHours: {
        type: Number
    },
    weeklyMessageCount: {
        type: Number
    },
    weeklyMessageCountCollection: [
        {
            type: Number,
        }
    ]
});

memberSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
