// Modules
const mongoose = require("mongoose");

// -----------------------------IMPORTS---------------------------------------

// Config to connect db with server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected!");
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;