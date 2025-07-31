// db.js
const mongoose = require('mongoose');
const { config } = require('./app.config');

const connectDatabase = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("🔗 Connection string format:", config.MONGO_URI ? "Valid format detected" : "❌ Invalid format");

    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Successfully connected to MongoDB database");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB database:", error.message);
    console.error("🔍 Full error details:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDatabase;
