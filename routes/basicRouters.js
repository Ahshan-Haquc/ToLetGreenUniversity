const express = require("express");
const Model = require("../models/studentSchema");
const PostShareModel = require("../models/postShareSchema");
const NotificationModel = require("../models/notification");
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


basicRouter.post("/login", availableSeatFetch, async (req, res, next) => {
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
basicRouter.get("/messages", accessPermission, (req, res) => {
  res.send("welcome to message page. It will be inplement later.");
});

//router for notification
basicRouter.get('/notification', accessPermission, async (req, res) => {
  console.log("Notification get router is working");

  const notificationArray = [];
  const userNotifications = await NotificationModel.findOne({ userId: req.studentInfo._id });

  if (userNotifications) {
    for (const element of userNotifications.notificationInfo) {
      const user = await Model.findOne({ _id: element.notificationFromUser });
      const post = await PostShareModel.findOne({ _id: element.notificationFromPost });

      notificationArray.push({
        notificationId: element._id,
        notificationFrom: element.notificationFrom,
        date: element.date,
        notificationFromUser: user,
        notificationFromPost: post
      });
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
    const postName = req.body.pageName;
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const postBy = new mongoose.Types.ObjectId(req.body.postBy);
    const postId = new mongoose.Types.ObjectId(req.body.postId);

    const isUserExist = await NotificationModel.findOne({ userId: postBy });

    if (isUserExist) {
      const isRequested = isUserExist.notificationInfo.some(info => info.notificationFromPost.equals(postId));

      if (isRequested) {
        return res.status(200).json({ requestSent: "no" });
      } else {
        isUserExist.notificationInfo.push({
          notificationFrom: postName,
          notificationFromUser: userId,
          notificationFromPost: postId
        });

        await isUserExist.save();
        return res.status(200).json({ requestSent: "yes" });
      }
    } else {
      const newEntry = new NotificationModel({
        userId: postBy,
        notificationInfo: [{
          notificationFrom: postName,
          notificationFromUser: userId,
          notificationFromPost: postId
        }]
      });

      await newEntry.save();
      return res.status(200).json({ requestSent: "yes" });
    }
  } catch (error) {
    console.log("Error in notification router:", error);
    next(error);
  }
});

// basicRouter.post('/deleteNotification', accessPermission, async (req,res,next)=>{
//   try {
//     console.log("Delete notification router is working.");
//     const notificationId = req.body.notificationId;
//     console.log(typeof notificationId,notificationId);

//     const notification = await notificationModel.findOne({userId:req.studentInfo._id});
//     console.log(notification);

//     const notificationInArrayExist = notification.notificationInfo.some(info => info._id.equals(notificationId));
//     console.log("notification found : ");
//     console.log(notificationInArrayExist);

//     res.redirect('/notification');

//   } catch (error) {
//     console.log("Error in deleting notification router.");
//     next(error);
//   }
// })

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