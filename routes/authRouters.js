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



//routers for signup
route.get("/signup", (req, res) => {
  res.render("signup",{student:false});
});

route.post("/signup", async (req, res, next) => {
  try {
    //hashing password
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    //taking input values from signup.ejs
    const studentInfo = new Model({
      firstName: req.body.fname,
      lastName: req.body.lname,
      studentId: req.body.studentId,
      email: req.body.email,
      password: hashPassword,
      phone: req.body.phone,
      gender: req.body.gender,
      department: req.body.department,
      batch: req.body.batch,
    });

    //generating token
    const token = await studentInfo.generateToken();

    //generating cookie using that token
    res.cookie("studentCookie", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    await studentInfo.save();

    //rendering in login.ejs page
    console.log("Sign up succesful.");
    
    res.status(200).redirect('/login');
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      // Duplicate key error code
      res
        .status(400)
        .json({ error: "You entered duplicate value in the input." });
    } else {
      next(err);
    }
  }
});

//routers for login without error means studentId or password is correct while just want to see the login page
route.get("/login",(req, res) => {
  res.render("login", { error: false, student: false });
});


route.post("/login", availableSeatFetch, async (req, res, next) => {
  try {
    const user = await Model.findOne({ studentId: req.body.studentId });

    if (user) {
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (isValidPassword) {
        // Generate token and set cookie
        const token = await user.generateToken();
        res.cookie("studentCookie", token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        res.status(200).redirect('/home');
      } else {
        res.status(400).render("login", { error: true, student: false });
      }
    }
  } catch (err) {
    res.status(500).render("login", { error: true });
  }
});


//router for logout
route.post("/logout", accessPermission, async (req, res) => {
  req.studentInfo.tokens = []; //tokens array er sob delete kore dilam

  res.clearCookie("studentCookie");
  await req.studentInfo.save();

  // const redirectTo = req.query.redirect || '/homePageToLet';  // Default to homePageToLet if no redirect provided
  // res.render("login", { error: false, redirect: redirectTo, student: false });

  res.redirect('/login');
});


//main home page
route.get("/home",accessPermission,(req,res)=>{
  try {
    res.status(200).render("home",{
      student: req.studentInfo,
    });
  } catch (error) {
    res.send("error in home page.");
  }
})

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

//router for profile page
route.get("/profile", accessPermission, async (req, res) => {
  try {
    // .find({}) ----> eita ekta array of object return kore, ejs file a etake if else & loop diye access korte hobe
    // .findOne({}) ----> eita just akta  object return kore, tai etake ejs file a dirrectly access kora jabe
    const postInfo = {id:324653456,name:"Ahsan"};
    // const postInfo = await PostShareModel.find({
    //   studentPostedId: req.studentInfo._id,
    // });
    console.log("working on profile router");

    //ekhane aro kaj baki ase, res.render korte hobe
    res.status(200).render("profile", {
      student: req.studentInfo,
      studentPost: postInfo,
    });
  } catch (error) {
    console.log(error);
    res.send("profile router error, Please check vs code:");
  }
});

//router for message
route.get("/messages", accessPermission, (req, res) => {
  res.send("welcome to message page. It will be inplement later.");
});

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
        roomImages: imagePaths, // Save image paths to roomImages
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

route.get("/confirmToletSeat", accessPermission, async (req, res) => {
  try {
    const postID = req.query.postID; // Extract postID from query parameters
    console.log("confirmToLetSeat router working"); // For debugging

    // fetching post all info by using incoming postID 
    const postInfo = await PostShareModel.findOne({_id:postID});

    res.status(200).render("confirmToletSeat", {
      student: req.studentInfo,
      postInfo: postInfo,
    });
  } catch (error) {
    res.send("Confirm seat router get df error: " + error);
  }
});

//showing facilities of ToLet when clicking button in seeAllAvailablePost is toLet
route.post("/facilitiesShowUsingPopup",async (req,res)=>{
  //this will come from frontend
  const postId = req.body;

  const data = await PostShareModel.findOne({_id:postId.postId});

  //seperating only just facilities from that data object
  const arrayOfFacilities = data.facilities;

  res.status(200).json({facilities: arrayOfFacilities});
})

// updating like and likeCounts
route.post("/toggle-like", async (req, res) => {
  const { postId, userId } = req.body;

  console.log("working on toggle like");

  try {
      const post = await PostShareModel.findById(postId);
      
      // Check if user has already liked the post
      const userIndex = post.likes.indexOf(userId);

      if (userIndex === -1) {
          // User has not liked the post yet, so add their ID and increment likeCount
          post.likes.push(userId);
          post.likeCount += 1;
      } else {
          // User has already liked the post, so remove their ID and decrement likeCount
          post.likes.splice(userIndex, 1);
          post.likeCount -= 1;
      }

      await post.save();

      // Calculating rating
      const updateRating = ratingCalculate(post.likeCount, post.dislikeCount);
      post.reviewScore = updateRating;
      await post.save();

      res.json({ likeCount: post.likeCount, liked: userIndex === -1 });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while toggling the like." });
  }
});

// updating dislike and dislikeCounts
route.post("/toggle-dislike", async (req, res) => {
  const { postId, userId } = req.body;

  console.log("working on toggle dislike");

  try {
      const post = await PostShareModel.findById(postId);
      
      // Check if user has already liked the post
      const userIndex = post.dislikes.indexOf(userId);

      if (userIndex === -1) {
          // User has not liked the post yet, so add their ID and increment likeCount
          post.dislikes.push(userId);
          post.dislikeCount += 1;
      } else {
          // User has already liked the post, so remove their ID and decrement likeCount
          post.dislikes.splice(userIndex, 1);
          post.dislikeCount -= 1;
      }

      await post.save();

      // Calculating rating
      const updateRating = ratingCalculate(post.likeCount, post.dislikeCount);
      post.reviewScore = updateRating;
      await post.save();
      
      res.json({ dislikeCount: post.likeCount, disliked: userIndex === -1 });  //Send updated like count and like status
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while toggling the like." });
  }
});

//router for saving any post
route.post("/savePost",async (req,res)=>{
  try {
    const name = req.body.postName;
    const userId = req.body.userId;
    const postId = req.body.postId;

    const user = await Model.findOne({_id:userId});

    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({saved:"yes"});
  } catch (error) {
    console.log("issue occur in saving post router.");
    next(error);
  }
})

// -----------------------------------------------
// -------------------------------------------------
// ------------gmail er password likhci niche oita delete korte hobe 
// ---------------------------------------------
// ----------------------------------------------

//this is for sending email from website to my gmail account
route.post("/send-email", async (req, res) => {
  const { userEmail, userMessage } = req.body;

  try {
      // Create a transporter object
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.MY_EMAIL, // Replace with your Gmail address
              pass: process.env.MY_PASSWORD, // Replace with your Gmail App Password
          },
      });

      // Define the email options
      const mailOptions = {
          from: userEmail, // The sender's email address
          to: "amar gmail dibe@gmail.com", // Replace with your Gmail address
          subject: "Message from Green University Student Branch website",
          text: `You have received a message from ${userEmail}:\n\n${userMessage}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
});



module.exports = route;

