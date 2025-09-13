const express = require('express')
const app = express();
const basicRouters = require('./routes/basicRouters')
const authRouter = require('./routes/authRouters')
const buyAndSellRouter = require('./routes/buyAndSellRouter')
const lostFoundRouter = require('./routes/lostAndFoundRouters')
const foodCornerRouter = require('./routes/foodCorner')
const bloodHelpRouter = require('./routes/bloodHelpRouter')
const dbConnection = require('./config/dbConnection')
const errorHandler = require('./middlewares/errorHandler')

const seePost = require('./routes/seePost')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

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
dbConnection()

//base router
app.use('/',authRouter);
app.use('/',basicRouters);
app.use('/',buyAndSellRouter);
app.use('/',lostFoundRouter);
app.use('/',foodCornerRouter);
app.use('/',bloodHelpRouter);


//default error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
//starting sarver
app.listen(PORT,()=>{
    console.log("Server started")
})