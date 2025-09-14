const mongoose = require('mongoose');

let isConnected = false; // Track the connection state

const databaseConnect = async () => {
    if (isConnected) {
        console.log("=> Using existing MongoDB connection");
        return;
    }

    try {
        const db = await mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/GUBStudentBridge',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        isConnected = db.connections[0].readyState; // readyState 1 = connected
        console.log("Database successfully connected with MongoDB Atlas");
    } catch (err) {
        console.error("Not connected with database:", err.message);
        throw new Error("Database connection failed");
    }
};

module.exports = databaseConnect;
