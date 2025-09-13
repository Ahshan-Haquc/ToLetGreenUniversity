const mongoose = require('mongoose');
const databaseConnect=async ()=>{
    await mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/GUBStudentBridge', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    .then(()=>(console.log("Database succesfully connected with MongoDB Atlas")))
    .catch((err)=>(console.log("Not conneted with database.")));
}
module.exports=databaseConnect;