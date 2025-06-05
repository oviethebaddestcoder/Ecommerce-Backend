const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Clerk-provided user ID
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Primary email of the user
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Display name or username
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    // User role for authorization
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Email or account verification status
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    versionKey: false, // Removes __v version key
  }
);

// Optional: transform output when sending to client
UserSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model("User", UserSchema);
