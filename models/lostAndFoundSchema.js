const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    dateLost: { type: Date, required: true },
    locationLost: { type: String, required: true },
    locationCategory: { type: String, required: true },
    description: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ["Lost", "Found"], default: "Lost" },
    images: {
        type: [String], // Array of image URLs
        validate: [arrayLimit, 'You can upload up to 3 images']
    },
    available: {
        type: String,
        enum: ["yes", "no"],
        default: "yes",
    },
    studentPostedId: {
        type: mongoose.Types.ObjectId,
        ref: "StudentInformation",
    },
    postDate:{
      type: Date,
      default: Date.now,
    }
});

// function for check if user uploaded more then 3 pictures or not 
function arrayLimit(val) {
    return val.length <= 5;
  }

const postModel = mongoose.model("LostAndFoundPostShare", postSchema);

module.exports = postModel;
