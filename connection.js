const express = require('express')
const app = express();
const basicRouters = require('./routes/basicRouters')
const authRouter = require('./routes/authRouters')
const buyAndSellRouter = require('./routes/buyAndSellRouter')
const lostFoundRouter = require('./routes/lostAndFoundRouters')
const seePost = require('./routes/seePost')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
// const upload = require("../middlewares/uploadImages"); //test

//giving permitions to use these
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
dotenv.config();

//setting view engine as a ejs
app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

//connecting with database
mongoose
        .connect("mongodb://localhost/ToLetGreenUniversity")
        .then(()=> console.log("Connected with database succesfully."))
        .catch((err)=> console.error("Database not connected."))

//base router
app.use('/',authRouter);
app.use('/',basicRouters);
app.use('/',buyAndSellRouter);
app.use('/',lostFoundRouter);

//default error handler
function errorHandler(err,req,res,next){
    if(res.headersSent){
        return next(err);
    }
    console.log(err);
    res.status(500).json({error:"Default error handler find a error."})
}
app.use(errorHandler)

//starting sarver
app.listen(3000,()=>{
    console.log("Port is connected on 3000.")
})