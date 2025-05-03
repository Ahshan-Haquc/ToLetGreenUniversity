const mongoose = require("mongoose");

const bloodHelpSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
    },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact: {
    type: String, // Optional: can be shown publicly or hidden
    default: ""
  },
  dateNeeded: {
    type: Date, // Only applicable for requests
  },
  description: {
    type: String,
    default: ""
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

const BloodHelpModel = mongoose.model("BloodHelp", bloodHelpSchema);
module.exports = BloodHelpModel;
