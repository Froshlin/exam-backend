// api/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth"); // Import the middleware
const router = express.Router();

// Simulated token blacklist (for logout, optional)
const tokenBlacklist = new Set();

// Middleware to check if token is blacklisted (optional)
const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token has been invalidated" });
  }
  next();
};

// Register Route for Students
router.post("/register", async (req, res) => {
  try {
    const { role, password, matricNumber } = req.body;

    if (role !== "student") {
      return res.status(400).json({ message: "Invalid role for this endpoint" });
    }

    if (!matricNumber) {
      return res.status(400).json({ message: "Matric number is required" });
    }

    const existingUser = await User.findOne({ matricNumber });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A student with this matric number already exists" });
    }

    const user = new User({ role: "student", password, matricNumber });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, matricNumber: user.matricNumber },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "24h" }
    );

    return res
      .status(201)
      .json({ token, message: "Student registration successful" });
  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (role !== "admin") {
      return res.status(400).json({ message: "Invalid role for this endpoint" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An admin with this email already exists" });
    }

    const user = new User({ role: "admin", email, password });

    await user.save();

    return res.status(201).json({ message: "Admin registration successful" });
  } catch (error) {
    console.error("Admin registration error:", error);
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

    const user = role === "student"
      ? await User.findOne({ matricNumber })
      : await User.findOne({ email });

    if (!user || user.role !== role) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last activity
    user.lastActivity = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, matricNumber: user.matricNumber },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "24h" }
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
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in user details (with middleware)
router.get("/me", authenticateToken, checkBlacklist, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Logout endpoint (optional, for future use)
// router.post("/logout", authenticateToken, (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(400).json({ message: "No token provided" });
//   }

//   // Add token to blacklist
//   tokenBlacklist.add(token);
//   res.status(200).json({ message: "Logged out successfully" });
// });

module.exports = router;