const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,    // hashed password for email logins
  googleId: String,    // set when user signs up via Google
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
