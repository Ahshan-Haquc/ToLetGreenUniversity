const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },
      category: {
        type: String,
        required: true,
        // enum: ['Electronics', 'Furniture', 'Computer', 'Phone', 'Other'] // Modify categories as needed
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      condition: {
        type: String,
        required: true,
        // enum: ['New', 'Used', 'Like New']
      },
      negotiable:{
        type: String,
        require: true,
        default: "Yes"
      },
      description: {
        type: String,
        trim: true
      },
      contact: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      images: {
        type: [String], // Array of image URLs
        validate: [arrayLimit, 'You can upload up to 3 images']
      },
      postDate: {
        type: Date,
        default: Date.now
      },
    available: {
        type: String,
        enum: ["yes", "no"],
        default: "yes",
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

// function for check if user uploaded more then 3 pictures or not 
function arrayLimit(val) {
    return val.length <= 5;
  }

const postModel = mongoose.model("BuyAndSellPostShare", postSchema);

module.exports = postModel;
