// api/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new course
router.post("/", async (req, res) => {
  try {
    const { _id, name } = req.body;

    // Validate that name is provided
    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    // Create a new course (let MongoDB generate _id if not provided)
    const newCourse = new Course({ _id: _id || undefined, name });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) a course
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that name is provided
    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a course
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;