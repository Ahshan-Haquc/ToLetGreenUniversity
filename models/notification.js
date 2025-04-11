const mongoose = require("mongoose");

const notification = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentInformation'
    },
    notificationInfo:[{
        notificationType:{
            type: String,
            enum:["Request","Response"]
        },
        notificationFrom:{
            type: String,
        },
        notificationFromUser:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PostShare'
        },
        notificationFromPost:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PostShare'
        },
        date:{
            type: Date,
            default: Date.now
        }
    }]
});

const notificationModel = mongoose.model("Notification",notification);

module.exports = notificationModel;