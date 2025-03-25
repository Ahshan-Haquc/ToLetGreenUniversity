const express = require('express');
const router = express.Router();
const accessPermission = require("../middlewares/accessPermission");

router.get('/lostAndFoundHomePage',accessPermission,(req,res)=>{
    try {
        res.status(200).render("lostAndFoundHomePage",{
            student: req.studentInfo
        });
    } catch (error) {
        console.log("Error in lost and found home page get router.");
        console.log(error);
    }
})

module.exports = router;