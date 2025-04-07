// api/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const { role, matricNumber, email, password } = req.body;

    // Validate input based on role
    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required" });
    }
    if (role === "student" && !matricNumber) {
      return res.status(400).json({ message: "Matric number is required for students" });
    }
    if (role === "admin" && !email) {
      return res.status(400).json({ message: "Email is required for admins" });
    }

    const newUser = new User({
      role,
      matricNumber: role === "student" ? matricNumber : undefined,
      email: role === "admin" ? email : undefined,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) a user
router.put("/:id", async (req, res) => {
  try {
    const { role, matricNumber, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        role,
        matricNumber: role === "student" ? matricNumber : undefined,
        email: role === "admin" ? email : undefined,
        password,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;