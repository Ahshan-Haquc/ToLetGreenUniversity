const mongoose = require('mongoose');

const postShareSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    seat: {
        type: Number,
        required: true,
    },
    numberOfRoom: {
        type: String,
        required: true,
    },
    roomCapacity: {
        type: String,
        required: true,
    },
    entryMonth: {
        type: String,
        required: true,
    },
    floorNumber: {
        type: String,
        required: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    timeRequire: {
        type: Number,
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
    googleMapLink: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    facilities: [{
        type: String,
    }],
    description: {
        type: String,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    images: {   // Array to store multiple image paths
        type: [String],
        default: []
    },
    available: {
        type: String,
        enum: ["yes", "no"],
        default: "yes",
    },
    postDate:{
        type: Date,
        default: Date.now
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    dislikeCount: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentInformation'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StudentInformation'
        }
    ],
    // Virtual field to calculate review score based on like and dislike ratio
    reviewScore: {
        type: Number,
        default: 3,  // Default to neutral rating
        min: 1,
        max: 5
    },
    studentPostedId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentInformation",
    }
});

const postModel = mongoose.model("PostShareInformation", postShareSchema);

module.exports = postModel;
