// api/questions.js
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// POST a new question
router.post("/", async (req, res) => {
  try {
    const { courseId, text, options, correctAnswer } = req.body;

    // Validate input
    if (!courseId || !text || !options || !correctAnswer) {
      return res.status(400).json({
        message: "Missing required fields",
        requiredFields: ["courseId", "text", "options", "correctAnswer"],
      });
    }

    // Create new question
    const newQuestion = new Question({
      courseId,
      text,
      options,
      correctAnswer,
    });

    // Save question to MongoDB
    await newQuestion.save();

    // Respond with created question
    res.status(201).json({
      message: "Question added successfully",
      question: newQuestion,
    });
  } catch (err) {
    console.error("Error adding question:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Error adding question",
      error: err.message,
    });
  }
});

// GET all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error("Error retrieving questions:", err);
    res.status(500).json({
      message: "Error retrieving questions",
      error: err.message,
    });
  }
});

// GET questions by course
router.get("/:courseId", async (req, res) => {
  try {
    const questions = await Question.find({
      courseId: req.params.courseId,
    });

    res.json(questions);
  } catch (err) {
    console.error("Error retrieving questions:", err);
    res.status(500).json({
      message: "Error retrieving questions",
      error: err.message,
    });
  }
});

// GET a single question by ID
router.get("/question/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.error("Error retrieving question:", err);
    res.status(500).json({
      message: "Error retrieving question",
      error: err.message,
    });
  }
});

// UPDATE a question
router.put("/:id", async (req, res) => {
  try {
    const { courseId, text, options, correctAnswer } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { courseId, text, options, correctAnswer },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({
      message: "Error updating question",
      error: err.message,
    });
  }
});

// DELETE a question
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({
      message: "Question deleted successfully",
      question: deletedQuestion,
    });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({
      message: "Error deleting question",
      error: err.message,
    });
  }
});

module.exports = router;