const mongoose = require('mongoose');

const connectDB = async () => {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Optional but good
  });
};

module.exports = connectDB;
