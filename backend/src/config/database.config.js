// db.js
const mongoose = require('mongoose');
const { config } = require('./app.config');

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo database");
  } catch (error) {
    console.error("Error connecting to Mongo database:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDatabase;
