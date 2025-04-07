// api/exam.js
const express = require("express");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Create an exam (Admin-only route)
router.post("/create", async (req, res) => {
  const { courseId, questions } = req.body;

  const exam = new Exam({ courseId, questions });
  await exam.save();

  res.status(201).json(exam);
});

// Get Exam Questions
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;

  const exam = await Exam.findOne({ courseId });
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  res.json(exam.questions);
});

// Submit Exam for Grading
router.post("/:courseId/submit", authenticateToken, async (req, res) => {
  const { answers } = req.body;
  const { courseId } = req.params;
  const userId = req.user.id; // From authenticateToken middleware

  try {
    // Fetch questions from the Question collection
    const questions = await Question.find({ courseId });
    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "Questions not found for this course" });
    }

    // Calculate score
    let score = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score += 1;
      }
    });

    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    // Save the grade in the user's record
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    // Ensure user.grades is an array
    if (!Array.isArray(user.grades)) {
      user.grades = [];
    }

    // Check if the user already has a grade for this course
    const existingGradeIndex = user.grades.findIndex(
      (grade) => grade.courseId === courseId
    );
    if (existingGradeIndex !== -1) {
      // Update existing grade
      user.grades[existingGradeIndex].score = percentage;
    } else {
      // Add new grade
      user.grades.push({ courseId, score: percentage });
    }

    await user.save();

    res.status(200).json({ score: percentage });
  } catch (err) {
    console.error("Error submitting exam:", err);
    res.status(500).json({ message: "Error submitting exam", error: err.message });
  }
});

module.exports = router;