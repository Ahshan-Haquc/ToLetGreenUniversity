const express = require('express');
const buySellRouter = express.Router();
const accessPermission = require("../middlewares/accessPermission");
const upload = require("../middlewares/uploadImages");
const ratingCalculate = require("../controller/ratingCalculate");
const BuySellModel = require("../models/buyAndSellPostShareSchema")

buySellRouter.get('/buyAndSellHomePage',accessPermission,(req,res)=>{
    try {
        res.status(200).render("buyAndSell/buyAndSellHomePage",{
            student: req.studentInfo,
            comeFromFilterRouter: false,
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

buySellRouter.get('/buyAndSellSeePost',accessPermission,async(req,res)=>{
    try {
        const availablePosts = await BuySellModel.find({available:"yes"});

        res.status(200).render("buyAndSell/buyAndSellSeePost",{
            student: req.studentInfo,
            totalSeatAvailable: availablePosts
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

// router for doing post 
buySellRouter.get('/buyAndSellDoPost',accessPermission,(req,res)=>{
    try {
        res.status(200).render("buyAndSell/buyAndSellDoPost",{
            student: req.studentInfo
        });
    } catch (error) {
        console.log("Error in lost and found do post page get router.");
        console.log(error);
    }
})
buySellRouter.post('/buyAndSellDoPost',accessPermission,  upload.array('imageUpload', 5),async(req,res)=>{
    try {
        // const values = req.body;
        // Map uploaded files to get paths
      const imagePaths = req.files.map(file => file.path);

      const PostInfo = new BuySellModel({
        title: req.body.title,
        category: req.body.category,
        price:req.body.price,
        condition: req.body.condition,
        description: req.body.description,
        contact: req.body.contact,
        location: req.body.location,
        images: imagePaths,
        studentPostedId: req.studentInfo._id
      })

      await PostInfo.save();

        console.log("Sell post form submitted successfully");
        res.status(200).redirect('/buyAndSellHomePage');
    } catch (error) {
        console.log("Error in lost and found do post page POST router.");
        console.log(error);
    }
})

module.exports = buySellRouter;