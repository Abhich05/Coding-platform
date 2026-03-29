const mongoose = require("mongoose");
require('dotenv').config({ override: true });

async function connectDB() {
    if (!process.env.MONGO_URI || !process.env.MONGO_URI.trim()) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME,
        });
        console.log("MongoDB Connected Successfully");
        return connection;
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
}

module.exports = connectDB;
