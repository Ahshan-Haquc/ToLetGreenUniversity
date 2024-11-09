const mongoose = require('mongoose');

const postShareSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    seat: {
        type: String,
        required: true,
    },
    entryMonth: {
        type: String,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    timeRequire: {
        type: String,
        required: true,
    },
    locationVillage: {
        type: String,
        required: true,
    },
    locationDistick: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    facilities: [{
        type: String,
        default: "not set this moment",
    }],
    description: {
        type: String,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    roomImages: {   // Array to store multiple image paths
        type: [String],
        default: []
    },
    available: {
        type: String,
        enum: ["yes", "no"],
        default: "yes",
    },
    studentPostedId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentInformation",
    }
});

const postModel = mongoose.model("PostShareInformation", postShareSchema);

module.exports = postModel;
