const express = require("express");
const Model = require("../models/studentSchema");
const PostShareModel = require("../models/postShareSchema");
const route = express.Router();
const bcrypt = require("bcrypt");
const accessPermission = require("../middlewares/accessPermission");
const availableSeatFetch = require("../middlewares/availableSeatFetch");
const upload = require("../middlewares/uploadImages");
const ratingCalculate = require("../controller/ratingCalculate");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");


// -----------------
// this router only for To-let 
// ----------------


//router for ToLet home page
route.get("/homePageToLet",accessPermission, availableSeatFetch, (req, res) => {
    console.log("working homePageToLet router");
    try {
      res.status(200).render("homePageToLet",{
        availableSeat : req.availableSeatFetch,
        totalSeatAvailableLength : req.totalSeatAvailableLength,
        student: req.studentInfo,
        userAuthenticationError: false,
      });
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  }
);


//router for get post share page
route.get("/postShare", accessPermission,availableSeatFetch, (req, res) => {
  console.log("working post share get method.");
  try {
    if(req.unAuthenticateUser){
      res.status(200).render("homePageToLetToLet",{
        availableSeat : req.availableSeatFetch,
        totalSeatAvailableLength : req.totalSeatAvailableLength,
        student: req.studentInfo,
        userAuthenticationError: true,
      });
    }else{
      res.status(200).render("postShare", { student: req.studentInfo });
    }
  } catch (error) {
    res.send("try again");
  }
});


// Router for post share post
route.post(
  "/postShare",
  accessPermission,
  availableSeatFetch,
  upload.array('images', 5), // Handle image uploads (max 5)
  async (req, res, next) => {
    try {
      // Map uploaded files to get paths
      const imagePaths = req.files.map(file => file.path); // Array of paths for each uploaded image

      // Ensure facilities is stored as an array
      const facilities = Array.isArray(req.body.facilities)
        ? req.body.facilities // If already an array
        : [req.body.facilities].filter(Boolean); // Convert to array if single value or empty

      // Create a new post model where post info will store in db
      const postModel = new PostShareModel({
        title: req.body.title,
        seat: req.body.seat,
        numberOfRoom: req.body.numberOfRoom,
        roomCapacity: req.body.roomCapacity,
        entryMonth: req.body.entryMonth,
        floorNumber: req.body.floorNumber,
        rent: req.body.rent,
        distance: req.body.distance,
        timeRequire: req.body.timeRequire,
        locationVillage: req.body.locationVillage,
        locationDistick: req.body.locationDistick,
        googleMapLink: req.body.googleMapLink,
        gender: req.body.gender,
        facilities: facilities, // Properly handled facilities as an array
        description: req.body.description,
        contactNumber: req.body.contactNumber,
        images: imagePaths, // Save image paths to roomImages
        studentPostedId: req.studentInfo._id, // Save student ID for reference
      });

      // Save the post to the database
      const sharedPost = await postModel.save();

      // Find the user who posted
      const findUser = await Model.findOne({ _id: req.studentInfo._id });

      if (!findUser) {
        throw new Error("User not found"); // Handle case where user is not found
      }

      // Ensure sharedPosts array exists in the user document
      if (!Array.isArray(findUser.sharedPosts)) {
        findUser.sharedPosts = []; // Initialize as an empty array if undefined
      }

      // Push the new post's ID to the user's sharedPosts array
      findUser.sharedPosts.push(sharedPost._id);
      await findUser.save();

      console.log("Post shared successfully");
      res.redirect('/homePageToLet');
    } catch (error) {
      console.log("Error uploading images:", error.message);
      next(error);
    }
  }
);


//home page content part (means services routers)
route.get('/totalPostAvailable',accessPermission,availableSeatFetch,(req,res)=>{
  try {
    console.log("totalSeatAvailable router working.");
    res.status(200).render("seeAllAvailableSeat",{
      totalSeatAvailable : req.totalSeatAvailable,
      student: req.studentInfo,
      userAuthenticationError: false,
      comeFromFilterRouter: false,
    })
  } catch (error) {
    console.log("/totalPostAvailable error: ",error);
    next(error);
  }
})

//success rate page
route.get('/successRateSee',accessPermission,availableSeatFetch,(req,res)=>{
  try {
    res.status(200).render("successRatePost",{
      student: req.studentInfo,
      userAuthenticationError: false,
    })
  } catch (error) {
    console.log("success rate router error: ",error);
    next(error);
  }
})


//finding seats when clicking on "go" button for filter quick find
route.post("/findSeatByFiltering",accessPermission, async (req, res, next) => {
  try {
    //taking range limit and location from input in the ejs file
    const rangeLimitStart = req.body.renge1;
    const rangeLimitEnd = req.body.renge2;
    const houseLocation = req.body.location;

      //finding kon kon collection rent er moddhe ase
      const findSharedPostInRange = await PostShareModel.find({
        rent: { $gte: rangeLimitStart, $lte: rangeLimitEnd },locationDistick: houseLocation
        });
    

  res.status(200).render('seeAllAvailableSeat',{
    totalSeatAvailable : findSharedPostInRange,
      student: req.studentInfo,
      comeFromFilterRouter: true,
  })
  
  } catch (error) {
      console.log(error);
      next(error);
  }
});


//finding just seats counts when just someone put inputs for filter quick find without reloading page
route.post("/findJustNumberOfSeatsUsingFiltering",async (req,res)=>{
  const {renge1,renge2,location} = req.body;

  const numberOfSeats = await PostShareModel.find({rent:{$gte:renge1,$lte:renge2},locationDistick: location});

  res.json({availableSeats:numberOfSeats.length});
})

//router for opening confirm page
route.get("/confirmToletSeat", accessPermission, async (req, res) => {
  try {
    const postID = req.query.postID; // Extract postID from query parameters
    console.log("confirmToLetSeat router working"); // For debugging

    // fetching post all info by using incoming postID 
    const postInfo = await PostShareModel.findOne({_id:postID});

    // finding which user posted this
    const studentPosted = await Model.findOne({_id:postInfo.studentPostedId});

    res.status(200).render("confirmToletSeat", {
      student: req.studentInfo,
      postInfo: postInfo,
      studentPosted: studentPosted,
    });
  } catch (error) {
    res.send("Confirm seat router get df error: " + error);
  }
});

// router for sending confirm request from tolet confirm page 
route.post("/confirmToletSeat", accessPermission, async (req,res,next)=>{
  try {
    const { postName, userId, postId } = req.body;

    // ekta notification namer collection banate hobe then seita diye notification er kaj handle korte hove

    // Convert userId string to ObjectId before querying
    // const user = await Model.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (user) {
      const isSaved = user.savedPosts.indexOf(postId);

      if(isSaved===-1){
        user.savedPosts.push(postId);
        await user.save();
        return res.status(200).json({ requestSent: "yes" });
      }else{
        //pop() korle just last element ta remove hobe
        //pull() korle existing specific element ta remove hobe oi array theke
        user.savedPosts.pull(postId);
        await user.save();
        return res.status(200).json({ requestSent: "no" });
      }

    }

    res.status(404).json({ requestSent: "no", message: "User not found" });
    
  } catch (error) {
    console.log("Issue occur during sending confirm request from confirm tolet page");
    next(error);
  }
})



//showing facilities of ToLet when clicking button in seeAllAvailablePost is toLet
route.post("/facilitiesShowUsingPopup",async (req,res)=>{
  //this will come from frontend
  const postId = req.body;

  const data = await PostShareModel.findOne({_id:postId.postId});

  //seperating only just facilities from that data object
  const arrayOfFacilities = data.facilities;

  res.status(200).json({facilities: arrayOfFacilities});
})




module.exports = route;

