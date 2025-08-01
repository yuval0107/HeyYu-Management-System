// db.js
const mongoose = require('mongoose');
const { config } = require('./app.config');

const connectDatabase = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", config.MONGO_URI ? "SET" : "NOT SET");
    
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // 10 seconds instead of 30
      socketTimeoutMS: 45000,
    });
    console.log("Connected to Mongo database successfully");
  } catch (error) {
    console.error("Error connecting to Mongo database:", error.message);
    console.error("Full error:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDatabase;
