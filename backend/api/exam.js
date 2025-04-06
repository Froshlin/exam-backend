const express = require('express');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const router = express.Router();

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

// Submit Exam for Grading
router.post('/:courseId/submit', async (req, res) => {
  const { answers } = req.body;
  const { courseId } = req.params;

  try {
    // Fetch questions from the Question collection instead of Exam
    const questions = await Question.find({ courseId });
    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'Questions not found for this course' });
    }

    let score = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctAnswer) {
        score += 1;
      }
    });

    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    res.status(200).json({ score: percentage });
  } catch (err) {
    console.error('Error submitting exam:', err);
    res.status(500).json({ message: 'Error submitting exam', error: err.message });
  }
});

module.exports = router;