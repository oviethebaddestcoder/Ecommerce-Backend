const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true,  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},

  isVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
