const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ["student", "admin"],
  },
  matricNumber: {
    type: String,
    required: function() { return this.role === "student"; },
    unique: function() { return this.role === "student"; },
  },
  email: {
    type: String,
    required: function() { return this.role === "admin"; },
    unique: function() { return this.role === "admin"; },
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);