const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

// Create an exam (Admin-only route)
router.post('/create', async (req, res) => {
  const { courseId, questions } = req.body;

  const exam = new Exam({ courseId, questions });
  await exam.save();

  res.status(201).json(exam);
});

// Get Exam Questions
router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params;

  const exam = await Exam.findOne({ courseId });
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  res.json(exam.questions);
});


// Submit exam and save grade
router.post("/:courseId/submit", authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id; // From authenticateToken middleware

    // Fetch questions for the course
    const questions = await Question.find({ courseId });
    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this course" });
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        correctAnswers += 1;
      }
    });
    const score = (correctAnswers / questions.length) * 100;

    // Save the grade in the user's record
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can submit exams" });
    }

    // Check if the user already has a grade for this course
    const existingGradeIndex = user.grades.findIndex(
      (grade) => grade.courseId === courseId
    );
    if (existingGradeIndex !== -1) {
      // Update existing grade
      user.grades[existingGradeIndex].score = score;
    } else {
      // Add new grade
      user.grades.push({ courseId, score });
    }

    await user.save();

    res.status(200).json({ score });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;