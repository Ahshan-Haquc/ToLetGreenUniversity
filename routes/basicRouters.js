const express = require("express");
const Model = require("../models/studentSchema");
const PostShareModel = require("../models/postShareSchema");
const NotificationModel = require("../models/notification");
const BuySellModel = require("../models/buyAndSellPostShareSchema");
const LostFoundModel = require("../models/lostAndFoundSchema");
const BloodHelpModel = require("../models/bloodHelpSchema");
const basicRouter = express.Router();
const bcrypt = require("bcrypt");
const accessPermission = require("../middlewares/accessPermission");
const availableSeatFetch = require("../middlewares/availableSeatFetch");
const upload = require("../middlewares/uploadImages");
const ratingCalculate = require("../controller/ratingCalculate");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const notificationModel = require("../models/notification");

//routers for signup
basicRouter.get("/signup", (req, res) => {
  res.render("signup",{student:false});
});

basicRouter.post("/signup", async (req, res, next) => {
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
basicRouter.get("/login",(req, res) => {
  res.render("login", { error: false, student: false });
});


basicRouter.post("/login",availableSeatFetch, async (req, res, next) => {
  try {
    const user = await Model.findOne({ studentId: req.body.studentId });

    if (user) {
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      console.log("valid pass is : ",isValidPassword);
      if (isValidPassword) {
        // Generate token and set cookie
        const token = await user.generateToken();
        res.cookie("studentCookie", token, { expires: new Date(Date.now() + 3600000), httpOnly: true });

        res.status(200).redirect('/home');
      } else {
        console.log("error in login");
        res.status(400).render("login", { error: true, student: false });
      }
    }
  } catch (err) {
    res.status(500).render("login", { error: true });
  }
});


//router for logout
basicRouter.post("/logout", accessPermission, async (req, res) => {
  req.studentInfo.tokens = []; //tokens array er sob delete kore dilam

  res.clearCookie("studentCookie");
  await req.studentInfo.save();

  // const redirectTo = req.query.redirect || '/homePageToLet';  // Default to homePageToLet if no redirect provided
  // res.render("login", { error: false, redirect: redirectTo, student: false });

  res.redirect('/login');
});


//main home page
basicRouter.get("/home",accessPermission,(req,res)=>{
  try {
    res.status(200).render("home",{
      student: req.studentInfo,
    });
  } catch (error) {
    res.send("error in home page.");
  }
})

//router for profile page
basicRouter.get("/profile", accessPermission, async (req, res) => {
  try {

    console.log("working on profile router");

    res.status(200).render("profile", {
      student: req.studentInfo,
      fetchedPosts: null
    });
  } catch (error) {
    console.log(error);
    res.send("profile router error, Please check vs code:");
  }
});

basicRouter.post("/updateUserInfoFromProfilePage",accessPermission, async (req,res,next)=>{
  console.log("Updating user info router is working");
  try {
    await Model.updateOne({ _id: req.studentInfo._id }, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentId: req.body.studentId,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        department: req.body.department,
        batch: req.body.batch,
      }
    });

    res.status(200).redirect('/profile');
  } catch (error) {
    console.log("Error in updating profile info router");
    next(error);
  }
})

basicRouter.post("/deletePostFromProfilePage",accessPermission, async (req,res,next)=>{
  console.log("Deleting post from profile page is working.");
  try {
    const btnName = req.body.bn; //this will store upper button name
    const belowBtnName = req.body.bbn; //this will store below button name
    const postId = new mongoose.Types.ObjectId(req.body.pi);

    const user = await Model.findOne({_id:req.studentInfo._id});

    if(btnName && belowBtnName && postId){
      if(btnName==="Saved Posts"){
        user.savedPosts.pull(postId);
        await user.save();

        res.json({message:"Yes"});
      }else if(btnName==="My Post"){
        user.sharedPosts.pull(postId);
        await user.save();

        // deleting post collection too 
        if(belowBtnName==="To-let"){
          await PostShareModel.deleteOne({_id:postId});
        }else if(belowBtnName==="Lost & Found"){
          await LostFoundModel.deleteOne({_id:postId});
        }else if(belowBtnName==="Buy & Sell"){
          await BuySellModel.deleteOne({_id:postId});
        }

        res.json({message:"Yes"});
      }else if(btnName==="Request Sented"){
        user.requestedInPost.pull(postId);
        await user.save();

        res.json({message:"Yes"});
      }else{
        console.log("working 4");
        return res.json({message:"No"});
      }
      
    }else{
      console.log("working 5");
      res.json({message:"No"});
    }
  } catch (error) {
    console.log("Error in deleting post from profile page");
    next(error);
  }
})

basicRouter.post("/fetchPostAndShowInProfile",accessPermission, async(req,res)=>{
  try {
    console.log("working on fetch post for profile router");
    const aboveButton = req.body.aboveButton;
    const belowButton = req.body.belowButton;
    let postsFounded = [];
    const user = await Model.findOne({_id: req.studentInfo._id});

    if(aboveButton==="savedPostsBtn" && belowButton==="toletBtn"){
      for(const element of user.savedPosts){
        const post = await PostShareModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="savedPostsBtn" && belowButton==="lostFoundBtn"){
      for(const element of user.savedPosts){
        const post = await LostFoundModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="savedPostsBtn" && belowButton==="buySellBtn"){
      for(const element of user.savedPosts){
        const post = await BuySellModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="savedPostsBtn" && belowButton==="bloodHelpBtn"){
      for(const element of user.savedPosts){
        const post = await BloodHelpModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: false //
          });
        }
      }
    }else if(aboveButton==="myPostBtn" && belowButton==="toletBtn"){
      for(const element of user.sharedPosts){
        const post = await PostShareModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="myPostBtn" && belowButton==="lostFoundBtn"){
      for(const element of user.sharedPosts){
        const post = await LostFoundModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="myPostBtn" && belowButton==="buySellBtn"){
      for(const element of user.sharedPosts){
        const post = await BuySellModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="myPostBtn" && belowButton==="bloodHelpBtn"){
      for(const element of user.sharedPosts){
        const post = await BloodHelpModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: false
          });
        }
      }
    }else if(aboveButton==="myAchievementBtn" && belowButton==="toletBtn"){
      for(const element of user.requestedInPost){
        const post = await PostShareModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="myAchievementBtn" && belowButton==="lostFoundBtn"){
      for(const element of user.requestedInPost){
        const post = await LostFoundModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }else if(aboveButton==="myAchievementBtn" && belowButton==="buySellBtn"){
      for(const element of user.requestedInPost){
        const post = await BuySellModel.findOne({_id: element});
        if(post){
          postsFounded.push({
            postId: post._id,
            postDate: post.postDate,
            postTitle: post.title,
            postImage: post.images
          });
        }
      }
    }

    res.status(200).json({fetchedPosts: postsFounded});
    
  } catch (error) {
    console.log("Error in fetchPostAndShowInProfile")
    res.json({message: error});
  }
})

//router for message
basicRouter.get("/messages", accessPermission, (req, res) => {
  res.send("welcome to message page. It will be inplement later.");
});

//router for notification
basicRouter.get('/notification', accessPermission, async (req, res) => {
  console.log("Notification get router is working");

  const notificationArray = [];
  let post = {};
  const userNotifications = await NotificationModel.findOne({ userId: req.studentInfo._id });

  if (userNotifications) {
    for (const element of userNotifications.notificationInfo) {
      const user = await Model.findOne({ _id: element.notificationFromUser });
      if(element.notificationFrom==="To-let"){
        post = await PostShareModel.findOne({ _id: element.notificationFromPost });
      }else if(element.notificationFrom==="Buy-sell"){
        post = await BuySellModel.findOne({ _id: element.notificationFromPost });
      }else if(element.notificationFrom==="Lost-found"){
        post = await LostFoundModel.findOne({ _id: element.notificationFromPost });
      }else if(element.notificationFrom==="Blood-Help"){
        post = await BloodHelpModel.findOne({ _id: element.notificationFromPost });
      }

      if(post){
        notificationArray.push({
          notificationId: element._id,
          notificationType: element.notificationType, //kon type er notification like request nki response
          notificationFrom: element.notificationFrom, //kon feature theke asche like tolet, buysell etc
          date: element.date, //kobe notification ta asche j req pathaise tar kas theke
          notificationFromUser: user, //kon user req pathaise
          notificationFromPost: post //kon post er theke pathaise
        });
    }
    }
  }

  res.status(200).render("notification", {
    student: req.studentInfo,
    notifications: notificationArray.length > 0 ? notificationArray : null,
  });
});


basicRouter.post("/notification", accessPermission, async (req, res, next) => {
  console.log("Notification post router working.");
  try {
    const requestType = req.body.requestType;
    const postName = req.body.pageName;
    const userId = new mongoose.Types.ObjectId(req.body.userId); //which user using this website
    const postBy = new mongoose.Types.ObjectId(req.body.postBy); //which user posted this
    const postId = new mongoose.Types.ObjectId(req.body.postId); //for which post that user requesting

    if(requestType==="Request"){
    //updating user request field by this post id in student schema
    const userRequested = await Model.findOne({_id: userId});
    if(userRequested.requestedInPost.includes(postId)){
      userRequested.requestedInPost.pull(postId);
      await userRequested.save();
      return res.status(200).json({ requestSent: "no" });
    }else{
      userRequested.requestedInPost.push(postId);
      await userRequested.save();
    }
  }
    //checking is this user is already exist in notification collection
    const isUserExist = await NotificationModel.findOne({ userId: postBy });

    if (isUserExist) {
      const isRequested = isUserExist.notificationInfo.some(info => info.notificationFromPost.equals(postId));
const isRequestedType = isUserExist.notificationInfo.some(info => info.notificationType === requestType);


      if (isRequested && isRequestedType) {
        return res.status(200).json({ requestSent: "yes" });
      } else {
        isUserExist.notificationInfo.push({
          notificationType: requestType, //kon type er notification like request nki response
          notificationFrom: postName, //kon feature theke asche like tolet, buysell etc
          notificationFromUser: userId, //kon user req pathaise
          notificationFromPost: postId //kon post er theke pathaise
        });

        await isUserExist.save();
        return res.status(200).json({ requestSent: "yes" });
      }
    } else {
      const newEntry = new NotificationModel({
        userId: postBy,
        notificationInfo: [{
          notificationType: requestType,
          notificationFrom: postName,
          notificationFromUser: userId,
          notificationFromPost: postId
        }]
      });

      await newEntry.save();
      res.status(200).json({ requestSent: "yes" });
    }
  } catch (error) {
    console.log("Error in notification router:", error);
    next(error);
  }
});

basicRouter.post('/deleteNotification', accessPermission, async (req, res, next) => {
  try {
    console.log("Delete notification router is working.");
    const notificationId = req.body.notificationId;

    if (!notificationId) {
      console.log("Notification ID is missing.");
      return res.status(400).json({ error: "Notification ID is required" });
    }

    const notification = await NotificationModel.findOne({ userId: req.studentInfo._id });

    if (!notification) {
      console.log("No notifications found for this user.");
      return res.status(404).json({ error: "Notification not found" });
    }

    // Check if the notification exists in the array
    const notificationIndex = notification.notificationInfo.findIndex(info => info._id.toString() === notificationId);

    if (notificationIndex === -1) {
      console.log("Notification not found in array.");
      return res.status(404).json({ error: "Notification not found" });
    }

    // Remove the notification from the array
    notification.notificationInfo.splice(notificationIndex, 1);
    await notification.save();

    console.log("Notification deleted successfully.");
    res.redirect('/notification'); 

  } catch (error) {
    console.log("Error in deleting notification router.");
    next(error);
  }
});


//router for saving any post
basicRouter.post("/savePost",accessPermission, async (req, res, next) => {
  try {
    const { postName, userId, postId } = req.body;

    // Convert userId string to ObjectId before querying
    const user = await Model.findOne({ _id: new mongoose.Types.ObjectId(userId) });

    if (user) {
      const isSaved = user.savedPosts.indexOf(postId);

      if(isSaved===-1){
        user.savedPosts.push(postId);
        await user.save();
        return res.status(200).json({ saved: "yes" });
      }else{
        //pop() korle just last element ta remove hobe
        //pull() korle existing specific element ta remove hobe oi array theke
        user.savedPosts.pull(postId);
        await user.save();
        return res.status(200).json({ saved: "no" });
      }

    }

    res.status(404).json({ saved: "no", message: "User not found" });
  } catch (error) {
    console.log("Issue occurred in saving post router.", error);
    next(error);
  }
});

//router for seeing only one specific post from profile page by clicking  "View" button
basicRouter.get("/viewingOnlyOneSpecificPost", accessPermission, async (req, res, next) => {
  console.log("GET route to view specific post");

  try {
    const btnName = req.query.bn;
    const belowBtnName = req.query.bbn;
    const postId = new mongoose.Types.ObjectId(req.query.pi);

    let fetchedPost = {};

    if (belowBtnName && postId) {
      if (belowBtnName === "To-let") {
        fetchedPost = await PostShareModel.findOne({ _id: postId });
      } else if (belowBtnName === "Lost & Found") {
        fetchedPost = await LostFoundModel.findOne({ _id: postId });
      } else if (belowBtnName === "Buy & Sell") {
        fetchedPost = await BuySellModel.findOne({ _id: postId });
      }
    } else {
      return res.send("Invalid request. Go back to previous page.");
    }

    res.status(200).render("viewingOnlyOneSpecificPost", {
      student: req.studentInfo,
      post: fetchedPost,
      btnName: belowBtnName,
    });

  } catch (error) {
    console.log("Error rendering specific post page:", error);
    next(error);
  }
});


// updating like and likeCounts
basicRouter.post("/toggle-like", async (req, res) => {
  const { likeFrom, postId, userId } = req.body;

  console.log("working on toggle like");

  try {
      if(likeFrom === "To-let"){
        var post = await PostShareModel.findById(postId);
      }else if(likeFrom === "Buy-sell"){
        var post = await BuySellModel.findById(postId);
      }
      
      
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
basicRouter.post("/toggle-dislike", async (req, res) => {
  const { dislikeFrom, postId, userId } = req.body;

  console.log("working on toggle dislike");

  try {
    if(dislikeFrom === "To-let"){
      var post = await PostShareModel.findById(postId);
    }else if(dislikeFrom === "Buy-sell"){
      var post = await BuySellModel.findById(postId);
    }
      
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



// -----------------------------------------------
// -------------------------------------------------
// ------------gmail er password likhci niche oita delete korte hobe 
// ---------------------------------------------
// ----------------------------------------------

//this is for sending email from website to my gmail account
basicRouter.post("/send-email", async (req, res) => {
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


module.exports = basicRouter;