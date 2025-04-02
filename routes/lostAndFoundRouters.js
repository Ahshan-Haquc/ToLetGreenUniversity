const express = require('express');
const lostFoundRouter = express.Router();
const accessPermission = require("../middlewares/accessPermission");
const upload = require("../middlewares/uploadImages");
const ratingCalculate = require("../controller/ratingCalculate");
const Model = require("../models/studentSchema");
const lostFoundModel = require("../models/lostAndFoundSchema");
const mongoose = require('mongoose');

lostFoundRouter.get('/lostAndFoundHomePage',accessPermission,async(req,res)=>{
    console.log("Working on lostFound home page get router.");
    try {
        // const totalPostAvailable = await lostFoundModel.find();
        res.status(200).render("lostAndFound/lostAndFoundHomePage",{
            student: req.studentInfo,
            comeFromFilterRouter: false,
        });

        // res.status(200).render("buyAndSell/buyAndSellHomePage",{
        //     student: req.studentInfo,
        //     totalPostAvailable: totalPostAvailable.length,
        //     comeFromFilterRouter: false,
        // });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

lostFoundRouter.get('/lostAndFoundSeePost',accessPermission,async(req,res)=>{
    try {
        const availablePosts = await lostFoundModel.find({available:"yes"});

        const totalSeatAvailableArray = [];

        for (const element of availablePosts) {
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

        res.status(200).render("lostAndFound/lostAndFoundSeePost",{
            student: req.studentInfo,
            totalSeatAvailable: totalSeatAvailableArray,
            comeFromFilterRouter: false,
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

// router for doing post 
lostFoundRouter.get('/lostAndFoundDoPost',accessPermission,(req,res)=>{
    try {
        res.status(200).render("lostAndFound/lostAndFoundDoPost",{
            student: req.studentInfo
        });
    } catch (error) {
        console.log("Error in lost and found do post page get router.");
        console.log(error);
    }
})
lostFoundRouter.post('/lostAndFoundDoPost',accessPermission,  upload.array('imageUpload', 5),async(req,res)=>{
    try {
        // Map uploaded files to get paths
      const imagePaths = req.files.map(file => file.path);

      const PostInfo = new lostFoundModel({
        title: req.body.title,
        category: req.body.category,
        dateLost:req.body.dateLost,
        locationLost: req.body.locationLost,
        description: req.body.description,
        contact: req.body.contact,
        status: req.body.status,
        images: imagePaths,
        studentPostedId: req.studentInfo._id
      })

      await PostInfo.save();

        console.log("form submitted successfully");
        res.status(200).redirect('/lostAndFoundHomePage');
    } catch (error) {
        console.log("Error in lost and found do post page POST router.");
        console.log(error);
    }
})

// this router is for filter means quickFind post 
lostFoundRouter.post('/quickFindLostAndFound',accessPermission,async(req,res)=>{
    console.log("working on quickFind router");
    try {
        const data = req.body;

        const availablePosts = await lostFoundModel.find({price:{$gte : req.body.range1, $lte: req.body.range2}, category: req.body.category});

        res.status(200).render("buyAndSell/buyAndSellSeePost",{
            student: req.studentInfo,
            totalSeatAvailable: availablePosts,
            comeFromFilterRouter: true,
        });

    } catch (error) {
        console.log("Error in buySell quick find router : \n",error);
    }
})

//finding just seats counts when just someone put inputs for filter quick find without reloading page
// lostFoundRouter.post("/filterFetchResultAssynchronouslyInLostFound",async (req,res)=>{
//   const {renge1,renge2,category} = req.body;

//   const numberOfSeats = await lostFoundModel.find({price:{$gte:renge1,$lte:renge2},category: category});

//   res.json({availableSeats:numberOfSeats.length});
// })
lostFoundRouter.post("/filterFetchResultAssynchronouslyInLostFound", async (req, res) => {
    try {
        const { itemName, category, dateLost, location, status } = req.body;

        // Ensure all fields are provided before processing
        if (!itemName || !category || !dateLost || !location) {
            return res.json({ totalPosts: 0, message: "All fields must be filled" });
        }

        // Build query
        let query = {
            itemName: { $regex: new RegExp(itemName, "i") }, // Case-insensitive search
            category,
            dateLost,
            location: { $regex: new RegExp(location, "i") }
        };

        if (status) query.status = status; // "Lost" or "Found"

        const matchingPosts = await lostFoundModel.find(query);

        res.json({ totalPosts: matchingPosts.length });

    } catch (error) {
        console.log("Error in async lost & found filter router:\n", error);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = lostFoundRouter;