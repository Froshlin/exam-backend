const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  try {
    console.log("Received registration payload:", req.body);

    const { role, password, email, matricNumber } = req.body;

    // Validate input based on role
    if (role === "admin" && !email) {
      return res.status(400).json({ message: "Admin email is required" });
    }

    if (role === "student" && !matricNumber) {
      return res
        .status(400)
        .json({ message: "Matric number is required for students" });
    }

    // Check for existing user
    let existingUser;
    if (role === "admin") {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await User.findOne({ matricNumber });
    }

    if (existingUser) {
      console.log("Existing user found:", existingUser);
      return res.status(400).json({
        message:
          role === "admin"
            ? "An admin with this email already exists"
            : "A student with this matric number already exists",
      });
    }

    // Create new user object
    const user = new User({
      role,
      password, // Password hashing middleware should be applied in the User model
      ...(role === "admin" ? { email } : { matricNumber }),
    });

    console.log("Saving new user:", user);

    try {
      await user.save();
      console.log("User saved successfully:", user);

      // Generate JWT token only after successful registration
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res
        .status(201)
        .json({ token, message: "Registration successful" });
    } catch (saveError) {
      console.error("Save error:", saveError);

      // Handle duplicate key error (code 11000)
      if (saveError.code === 11000) {
        const duplicatedField = Object.keys(saveError.keyPattern)[0];
        return res.status(400).json({
          message: `${duplicatedField} is already in use`,
          error: saveError,
        });
      }

      return res.status(500).json({
        message: "Error saving user",
        error: saveError.message,
      });
    }
  } catch (error) {
    console.error("Unexpected error in registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { role, password, matricNumber, email } = req.body;

    if (role === "student" && !matricNumber) {
      return res
        .status(400)
        .json({ message: "Matric number is required for students" });
    }

    if (role === "admin" && !email) {
      return res.status(400).json({ message: "Email is required for admins" });
    }

    // Find user based on role-specific identifier
    const user =
      role === "student"
        ? await User.findOne({ matricNumber })
        : await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      token,
      role: user.role,
      message: "Login successful",
      ...(role === "admin"
        ? { email: user.email }
        : { matricNumber: user.matricNumber }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
