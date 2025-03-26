const express = require('express');
const buySellRouter = express.Router();
const accessPermission = require("../middlewares/accessPermission");

buySellRouter.get('/buyAndSellHomePage',accessPermission,(req,res)=>{
    try {
        res.status(200).render("buyAndSell/buyAndSellHomePage",{
            student: req.studentInfo
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

buySellRouter.get('/buyAndSellSeePost',accessPermission,(req,res)=>{
    try {
        res.status(200).render("buyAndSell/buyAndSellSeePost",{
            student: req.studentInfo
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

module.exports = buySellRouter;