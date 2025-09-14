const express = require('express');
const buySellRouter = express.Router();
const accessPermission = require("../middlewares/accessPermission");
const upload = require("../config/upload");
const ratingCalculate = require("../controller/ratingCalculate");
const Model = require("../models/studentSchema");
const BuySellModel = require("../models/buyAndSellPostShareSchema");
const mongoose = require('mongoose');

buySellRouter.get('/buyAndSellHomePage',accessPermission,async(req,res)=>{
    console.log("Working on buySell home page get router.");
    try {
        const totalPostAvailable = await BuySellModel.find();
        res.status(200).render("buyAndSell/buyAndSellHomePage",{
            student: req.studentInfo,
            totalPostAvailable: totalPostAvailable.length,
            comeFromFilterRouter: false,
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

buySellRouter.get('/buyAndSellSeePost',accessPermission,async(req,res)=>{
    console.log("Working on buy and sell see post router.");
    try {
        const availablePosts = await BuySellModel.find({available:"yes"});

        const totalSeatAvailableArray = [];

        for (const element of availablePosts) {
            const user = await Model.findOne({_id:element.studentPostedId});
      
            if(user){
              totalSeatAvailableArray.push({
              userFirstName: user.firstName,
              userLastName: user.lastName,
              userStudentId: user.studentId,
              userDepartment: user.department,
              userEmail: user.email,
              userPhone: user.phone,
              postInfo: element
            });
            }
          }

        res.status(200).render("buyAndSell/buyAndSellSeePost",{
            student: req.studentInfo,
            totalSeatAvailable: totalSeatAvailableArray,
            comeFromFilterRouter: false,
        });
    } catch (error) {
        console.log("Error in buy and sell see post get router.");
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

buySellRouter.post('/buyAndSellDoPost', accessPermission, upload.array('imageUpload', 3), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path);

    const PostInfo = new BuySellModel({
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      condition: req.body.condition,
      description: req.body.description,
      contact: req.body.contact,
      negotiable: req.body.negotiable,
      location: req.body.location,
      images: imageUrls, // Cloudinary URLs
      studentPostedId: req.studentInfo._id,
    });

    const savedPost = await PostInfo.save();

    const userPosted = await Model.findOne({ _id: req.studentInfo._id });
    userPosted.sharedPosts.push(savedPost._id);
    await userPosted.save();

    console.log("Sell post form submitted successfully");
    res.status(200).redirect('/buyAndSellHomePage');
  } catch (error) {
    console.log("Error in buy and sell do post:", error);
  }
});


// this router is for filter means quickFind post 
buySellRouter.post('/quickFindInBuySell',accessPermission,async(req,res)=>{
    console.log("working on quickFind router");
    try {
        const renge1 = req.body.renge1;
        const renge2 = req.body.renge2;
        const category = req.body.category;
        const condition = req.body.condition;

        const numberOfSeats = await BuySellModel.find({price:{$gte:renge1,$lte:renge2},category: category, condition: condition});

        const totalSeatAvailableArray = [];

        for (const element of numberOfSeats) {
            const user = await Model.findOne({_id:element.studentPostedId});
      
            totalSeatAvailableArray.push({
              userFirstName: user.firstName,
              userLastName: user.lastName,
              userStudentId: user.studentId,
              userDepartment: user.department,
              userEmail: user.email,
              userPhone: user.phone,
              postInfo: element
            });
          }

        res.status(200).render("buyAndSell/buyAndSellSeePost",{
            student: req.studentInfo,
            totalSeatAvailable: totalSeatAvailableArray,
            comeFromFilterRouter: true,
        });

    } catch (error) {
        console.log("Error in buySell quick find router : \n",error);
    }
})

//finding just seats counts when just someone put inputs for filter quick find without reloading page
buySellRouter.post("/filterFetchResultAssynchronouslyInBuySell",accessPermission,async (req,res)=>{
  const {renge1,renge2,category,condition} = req.body;

  const numberOfSeats = await BuySellModel.find({price:{$gte:renge1,$lte:renge2},category: category, condition: condition});

  res.json({availableSeats:numberOfSeats.length});
})

module.exports = buySellRouter;