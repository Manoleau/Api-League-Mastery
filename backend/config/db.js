const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Setting 'strictQuery' to false and connecting to MongoDB without a callback.
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connecté"); // Log on successful connection.
  } catch (err) {
    console.error(err); // Log any connection error.
    process.exit(1); // Exit the process with a failure code.
  }
}

module.exports = connectDB;
