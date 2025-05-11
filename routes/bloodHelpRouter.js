const express = require("express");
const bloodRouter = express.Router();
const StudentModel = require("../models/studentSchema");
const BloodHelpModel = require("../models/bloodHelpSchema");
const accessPermission = require("../middlewares/accessPermission");


bloodRouter.get("/bloodHelpHomePage",accessPermission, (req, res) => {
    res.render("bloodHelp/bloodHelpHome", {
        student: req.studentInfo
    });
});

// See all blood posts
bloodRouter.get("/seeBloodPost", accessPermission, async (req, res) => {
    try {
        const posts = await BloodHelpModel.find();
        if (!posts) {
            return res.status(200).json({"posts":0, "student":req.studentInfo});
        }
        res.status(200).json({"posts":posts, "student":req.studentInfo});
    } catch (error) {
        console.log("Error fetching blood posts");
        next(error);
    }
});

// See blood post by filtering by blood group
bloodRouter.post("/filterPostByBloodGroup", accessPermission, async (req, res, next) => {
    try {
        const bloodGroup = req.body.filterBloodGroupSelected;
        const posts = await BloodHelpModel.find({ bloodGroup });
        if (!posts) {
            return res.status(200).json({"posts":0, "student":req.studentInfo});
        }
        res.status(200).json({"posts":posts, "student":req.studentInfo});
    } catch (error) {
        console.log("Error fetching blood posts by blood group:", error);
        next(error);
    }
});

// See blood post by searching
bloodRouter.post("/searchBloodPosts", accessPermission, async (req, res, next) => {
  try {
    const { searchQuery } = req.body;

    // Case-insensitive regex search on bloodGroup or location
    const posts = await BloodHelpModel.find({
      $or: [
        { bloodGroup: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ]
    });

    return res.status(200).json({ posts, student: req.studentInfo });
  } catch (error) {
    console.log("Error in searchBloodPosts:", error);
    next(error);
  }
});


// Create a new blood post
bloodRouter.post("/createBloodPost", accessPermission, async (req, res, next) => {
  try {
    const { title, bloodGroup, dateNeeded, location, contact, note } = req.body;
    const newPost = new BloodHelpModel({
      title,
      bloodGroup,
      location,
      contact,
      dateNeeded,
      description: note || "",
      studentPostedId: req.studentInfo._id,
    });

    await newPost.save();

    // adding this post in student posted field so that i can know this user posted this
    req.studentInfo.sharedPosts.push(newPost._id);
    await req.studentInfo.save();
    res.status(201).redirect("/bloodHelpHomePage");
  } catch (error) {
    console.log("Error creating blood post:", error);
    next(error);
  }
});
// Student can register as a blood donor
bloodRouter.post("/registerAsBloodDonor", accessPermission, async (req, res, next) => {
  try {
    const { bloodGroup, address } = req.body;
    const user = await StudentModel.findById(req.studentInfo._id);
    if(user.bloodGroup && user.address) {
      user.bloodGroup = "";
      user.address = "";
      await user.save();
      return res.status(400).json({ message: "Registration cancelled." });
    }
    user.bloodGroup = bloodGroup;
    user.address = address;
    await user.save();
    res.status(200).json({ message: "Successfully registered as a blood donor" });
  } catch (error) {
    console.log("Error registering as blood donor:", error);
    next(error);
  }
});
//see all blood doner list
bloodRouter.get("/seeDonorList", accessPermission, async (req, res) => {
  try {
    const bloodDonors = await StudentModel.find({ bloodGroup: { $ne: "" } });
    if (!bloodDonors) {
      return res.status(404).json({ message: "No blood donors found" });
    }
    res.status(200).json(bloodDonors);
  } catch (error) {
    console.log("Error fetching blood donors:", error);
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
