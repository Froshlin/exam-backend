const express = require('express');
const Exam = require('../models/Exam');
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

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }

  const exam = await Exam.findOne({ courseId });
  if (!exam) {
    return res.status(404).json({ message: 'Exam not found' });
  }

  let score = 0;
  exam.questions.forEach((question) => {
    if (answers[question._id] === question.correctOption) {
      score += 1;
    }
  });

  const totalQuestions = exam.questions.length;
  const percentage = (score / totalQuestions) * 100;

  res.json({ score: percentage });
});


module.exports = router;
