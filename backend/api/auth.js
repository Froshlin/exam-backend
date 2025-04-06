const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

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
      return res.status(400).json({ message: "A student with this matric number already exists" });
    }

    const user = new User({ role: "student", password, matricNumber });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, matricNumber: user.matricNumber },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: "24h" } // Token expires in 24 hours, but inactivity logout will enforce 2 hours
    );

    return res.status(201).json({ token, message: "Student registration successful" });

  } catch (error) {
    console.error("Student registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Registration Route (No super admin required)
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
      return res.status(400).json({ message: "An admin with this email already exists" });
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
      return res.status(400).json({ message: "Matric number is required for students" });
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
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: "24h" } // Token expires in 24 hours, but inactivity logout will enforce 2 hours
    );

    res.json({
      token,
      role: user.role,
      message: "Login successful",
      ...(role === "admin" ? { email: user.email } : { matricNumber: user.matricNumber }),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get logged-in user details
router.get("/me", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

module.exports = router;