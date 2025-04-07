// api/exam.js
const express = require("express");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Grade = require("../models/Grade"); // Import the Grade model
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
  const studentId = req.user.id; // From authenticateToken middleware

  try {
    console.log("Submitting exam for:", { studentId, courseId, answers });

    // Fetch questions from the Question collection
    const questions = await Question.find({ courseId });
    if (!questions || questions.length === 0) {
      console.log("Questions not found for course:", courseId);
      return res.status(404).json({ message: "Questions not found for this course" });
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
    console.log("Calculated score:", { score, totalQuestions, percentage });

    // Save the grade in the Grade model
    const existingGrade = await Grade.findOne({ studentId, courseId });
    if (existingGrade) {
      // Update existing grade
      existingGrade.score = percentage;
      existingGrade.submittedAt = Date.now();
      await existingGrade.save();
      console.log("Updated existing grade:", existingGrade);
    } else {
      // Add new grade
      const newGrade = new Grade({
        studentId,
        courseId,
        score: percentage,
      });
      await newGrade.save();
      console.log("Created new grade:", newGrade);
    }

    res.status(200).json({ score: percentage });
  } catch (err) {
    console.error("Error submitting exam:", err);
    res.status(500).json({ message: "Error submitting exam", error: err.message });
  }
});

module.exports = router;