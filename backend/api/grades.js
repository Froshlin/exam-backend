// api/grades.js
const express = require("express");
const router = express.Router();
const Grade = require("../models/Grade");

// POST a new grade (submit exam result)
router.post("/", async (req, res) => {
  try {
    const { studentId, courseId, score } = req.body;

    // Validate input
    if (!studentId || !courseId || score === undefined) {
      return res.status(400).json({ message: "Student ID, course ID, and score are required" });
    }

    const newGrade = new Grade({ studentId, courseId, score });
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET grades for a specific student
router.get("/student/:studentId", async (req, res) => {
    try {
      const { studentId } = req.params;
      if (!studentId || studentId === "undefined") {
        return res.status(400).json({ message: "Invalid student ID" });
      }
  
      const grades = await Grade.find({ studentId })
        .populate("courseId", "name")
        .sort({ submittedAt: -1 });
      res.json(grades);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;