const express = require("express");
const bloodRouter = express.Router();
const BloodHelpModel = require("../models/bloodHelpSchema");
const accessPermission = require("../middlewares/accessPermission");


bloodRouter.get("/bloodHelpHomePage",accessPermission, (req, res) => {
    res.render("bloodHelp/bloodHelpHome", {
        student: req.studentInfo
    });
});

bloodRouter.get("/create-blood-post", accessPermission, (req, res) => {
  res.render("bloodHelp/createBloodPost",{
    student: req.studentInfo
  });
});


// ✅ Route: Create a new blood post (Donor or Request)
bloodRouter.post("/create-blood-post", accessPermission, async (req, res, next) => {
  try {
    const { type, bloodGroup, location, contact, dateNeeded, note } = req.body;
    const newPost = new BloodHelpModel({
      type,
      bloodGroup,
      location,
      contact,
      dateNeeded,
      note,
      createdBy: req.studentInfo._id
    });

    await newPost.save();
    res.status(201).json({ message: "Blood post created successfully" });
  } catch (error) {
    console.log("Error creating blood post:", error);
    next(error);
  }
});

// ✅ Route: Get all blood help posts (to show on board)
bloodRouter.get("/get-all-blood-posts", async (req, res, next) => {
  try {
    const posts = await BloodHelpModel.find().populate("createdBy", "name department");
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error fetching blood posts:", error);
    next(error);
  }
});

// ✅ Route: Get one specific post for full view
bloodRouter.get("/blood-post/:id", async (req, res, next) => {
  try {
    const post = await BloodHelpModel.findById(req.params.id).populate("createdBy", "name department");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.log("Error viewing blood post:", error);
    next(error);
  }
});

// ✅ Route: Delete a post from profile
bloodRouter.delete("/delete-blood-post/:id", accessPermission, async (req, res, next) => {
  try {
    const post = await BloodHelpModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.createdBy.equals(req.studentInfo._id)) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await BloodHelpModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting blood post:", error);
    next(error);
  }
});

bloodRouter.get("/bloodDonarList",accessPermission,(req,res)=>{
  res.render("bloodHelp/bloodDonerList",{
    student: req.studentInfo
  });
})

module.exports = bloodRouter;
