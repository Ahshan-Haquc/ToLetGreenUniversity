const mongoose = require('mongoose');

const food = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
});


const foodCornerSchema = new mongoose.Schema(food,"FoodTable");
module.exports = foodCornerSchema;