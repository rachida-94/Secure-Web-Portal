require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
})
.catch(error => {
  console.error("Failed to connect to MongoDB:", error.message);
  process.exit(1);
})

mongoose.connection.on("error", error => {
  console.error("MongoDB connection error:", error.message);
});