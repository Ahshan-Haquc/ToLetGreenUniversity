const express = require('express');
const foodRouter = express.Router();
const accessPermission = require("../middlewares/accessPermission");
const Food = require("../models/foodCornerSchema");

foodRouter.get('/foodHomePage',accessPermission,async (req, res) => {
    const foodAll = await Food.findAll({});

    res.render("foodCornerHomePage",{
        student: req.studentInfo,
        nadib: foodAll,
    });
});
foodRouter.post('/order',async (req,res)=>{
    const orderItem = req.body.order;
    console.log(orderItem);
    res.json(orderItem);


    const food = new Food({
        foodName: orderItem,
        totalPrice: req.body.totalPrice,
    });
    await food.save()
        .then(() => {
            console.log("Food item saved successfully!");
            res.status(200).send("Food item saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving food item:", error);
            res.status(500).send("Error saving food item.");
        });
})
module.exports = foodRouter;
